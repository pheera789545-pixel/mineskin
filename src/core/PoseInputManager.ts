import { getRendererState } from "../store";
import {
  cross,
  dot,
  identityM44,
  inverse,
  multiplyM4V3,
  normalize,
  subtractV3,
  V3,
} from "./maths";
import { MinecraftPart } from "./mesh";
import type { MiSkiRenderer } from "./MiSkiRenderer";
import {
  getModelTurn,
  isModelMoveLocked,
  setModelTranslation,
  getModelTranslation,
  setModelTurn,
} from "./modelTransform";
import {
  AXIS_GRAB_SLOP_PX,
  computeAxisHandles,
  computePoseHandles,
  findAxisHandleAt,
  findHandleAt,
  findNearestAxisHandle,
  getPoseSpace,
  HANDLE_GRAB_SLOP_PX,
  PoseAxis,
  PoseAxisHandle,
  PoseHandle,
  PoseMoveHandle,
  PoseTwistHandle,
  ringScreenSweep,
  rotationOnly,
} from "./PoseGizmo";
import {
  getPartTwistAxis,
  isPosePart,
  PoseLimb,
  PosePart,
  resolvePosePartMesh,
} from "./PoseSystem";
import {
  multiplyQuat,
  Quat,
  quatFromAxisAngle,
  quatFromUnitVectors,
  rotateV3ByQuat,
  swingTwistDecompose,
} from "./quaternion";
import { computeRay } from "./rayTracing";

/** Drag distance before a press is treated as a drag rather than a click. */
const DRAG_THRESHOLD_PX = 3;

/**
 * How far from a ring's centre the pointer has to sit, in CSS pixels, before
 * the sweep around it means anything.
 *
 * Only the plane reading needs this. Near the centre a spoke is all direction
 * and no length: a pointer a pixel to the left and a pointer a pixel to the
 * right are half a turn apart, and a drag seeded there would fling the limb
 * round on its first move. That matters now
 * that a press on the part is handed to the nearest ring, because a roll ring
 * is centred on the very handle that press lands on — so until the pointer has
 * left this radius the grab is simply carried along with it, and the turn
 * begins from wherever it steps out. Wider than the handle can be grabbed by,
 * so a press there always starts un-engaged and engages by leaning.
 */
const RING_ENGAGE_RADIUS_PX = 16;

/**
 * Dragging one of the three arrows at a limb's end. The end travels along that
 * one axis and no other, and how far along it goes is *measured* — the pointer
 * ray is intersected with the axis line — rather than inferred from how many
 * pixels the pointer moved in some screen direction.
 *
 * That is the difference that matters when working against a 2D reference: a
 * free drag has to guess which of the infinitely many 3D motions a flat pointer
 * movement meant, and its guess changes with the camera. Here the user names
 * the direction by which arrow they grab, so the same drag means the same thing
 * from any angle.
 */
type AxisDrag = {
  kind: "axis";
  pointerId: number;
  part: PoseLimb;
  axis: PoseAxis;
  mesh: MinecraftPart;
  startX: number;
  startY: number;
  /** Drag direction, in the joint's parent space. */
  localAxis: V3;
  /** The joint, in parent space: the fixed point the limb pivots about. */
  jointLocal: V3;
  /** The limb's end when the drag began, in parent space; the line runs through it. */
  tipLocal: V3;
  /** Twist held constant while the aim is re-solved, so sliding can't spin the limb. */
  twist: Quat;
  /** Direction the end points at rest-plus-twist, the aim solve's `from`. */
  aimFrom: V3;
  /**
   * Offset from where the axis line was grabbed to the limb's end, so the end
   * does not jump to the pointer on the first pixel of the drag.
   */
  grabOffset: number;
  exceededThreshold: boolean;
};

/**
 * Dragging one of the rings on a limb. The limb turns about that one axis —
 * the roll that sliding an end around can never produce, which is what turns a
 * palm outwards or squares a foot to the ground.
 *
 * The axis is the part's own, frozen as it stood when the ring was grabbed, so
 * the turn is a twist *of the limb* rather than of the body it hangs off. It
 * still composes on the left of the base rotation, which is the same thing: an
 * axis already carried through a rotation, applied outside it, turns the part
 * in its own frame.
 *
 * Measured the same way the arrows are, wherever the camera allows it: the
 * pointer ray meets the ring's plane, and the angle swept from where the drag
 * was grabbed is the angle the joint turns. So the limb stays under the pointer
 * all the way round rather than turning by however many pixels a drag happened
 * to travel. Which of the two readings this drag took is frozen in `measure`.
 */
type RotateDrag = {
  kind: "rotate";
  pointerId: number;
  part: PoseLimb;
  axis: PoseAxis;
  mesh: MinecraftPart;
  startX: number;
  startY: number;
  /** The turn axis, in the joint's parent space. */
  localAxis: V3;
  /** The joint, in that space: the centre of the circle the drag sweeps. */
  centerLocal: V3;
  /** Where the sweep is read: the ring's own plane, or the screen. */
  measure: RingMeasure;
  /** Pose of this joint when the drag began; the turn composes onto it. */
  baseRotation: Quat;
  turn: TurnTracker;
  exceededThreshold: boolean;
};

/**
 * Dragging one of the model handle's arrows. Nothing rotates: the whole skin
 * slides along that scene axis, writing the very offsets the sidebar's move
 * sliders hold — the handle and the sliders are two ways of setting one thing.
 *
 * Solved in scene space, outside the model's own turn, because that is where
 * those offsets act; and *measured* rather than accumulated — every move is
 * taken from where the drag started, so clamping at the end of a slider's range
 * can't ratchet the model, and letting go and grabbing again never drifts.
 */
type ModelMoveDrag = {
  kind: "model-move";
  pointerId: number;
  part: "body";
  startX: number;
  startY: number;
  /** Where the model sat when the drag began, in scene axes. */
  baseOffset: V3;
  /** The handle itself, in scene space: the anchor the travel is measured from. */
  anchor: V3;
  /** The single scene axis the drag is locked to. */
  axis: V3;
  /** Which of the three that is, so the arrow being dragged stays lit. */
  axisIndex: PoseAxis;
  /** How far along that axis the drag first landed. */
  grabAlong: number;
  exceededThreshold: boolean;
};

/** Dragging the model's ring: the whole skin turns on the spot. */
type ModelTurnDrag = {
  kind: "model-turn";
  pointerId: number;
  part: "body";
  startX: number;
  startY: number;
  /** The upright scene axis, and the model's centre on it. */
  axis: V3;
  center: V3;
  /** Where the sweep is read: the ring's own plane, or the screen. */
  measure: RingMeasure;
  /** The model's heading when the drag began; the turn is measured from it. */
  baseAngle: number;
  turn: TurnTracker;
  exceededThreshold: boolean;
};

type DragState = AxisDrag | RotateDrag | ModelMoveDrag | ModelTurnDrag;

/**
 * Running total of a ring drag.
 *
 * The angle around a circle only ever reads back as half a turn either way, so
 * a drag carried past that point would jump to the far side. Keeping the last
 * reading and adding the short way round between readings lets a drag keep
 * going in one direction as far as the joint allows.
 */
type TurnTracker = { last: number; total: number };

/**
 * How a ring drag reads the angle it has swept, chosen once when the ring is
 * grabbed and fixed for the drag's whole life — the camera cannot move while a
 * pointer is captured, and changing method halfway would show as a jump.
 *
 * **plane** is the exact reading and the one to prefer: the pointer ray meets
 * the circle's own plane, so the point that was grabbed stays under the pointer
 * however far the drag goes.
 *
 * **screen** is what a ring the camera has flattened falls back to. There is no
 * usable plane left to meet, so the travel along the sliver the ring has become
 * is counted instead, at the rate the ring turned at when it was round. That is
 * the same reading an arrow takes, and it is why a flattened ring is now as
 * easy to turn as an arrow is to slide.
 */
type RingMeasure =
  | {
      kind: "plane";
      /** Where on the circle the drag is holding, as a unit spoke from its centre. */
      grabDirection: V3;
      /** How far out the pointer must be for that spoke to mean anything. */
      minSpoke: number;
    }
  | {
      kind: "screen";
      /** Unit screen direction a drag winds the ring forwards along. */
      direction: { x: number; y: number };
      /** Device pixels of travel along it that make one radian. */
      pixelsPerRadian: number;
      /** Pointer position at the last reading; travel is counted between them. */
      lastX: number;
      lastY: number;
    };

/**
 * How square-on the axis has to be before its line can be intersected with the
 * pointer ray. Below this the two are near enough parallel that the solve is
 * numerically meaningless — looking straight down an arrow, there is no drag
 * that could tell one point on it from another — so the move is ignored and the
 * limb simply holds still until the user orbits or picks another arrow.
 */
const AXIS_PARALLEL_THRESHOLD = 0.08;

/**
 * How far from edge-on a plane has to be before the pointer ray can be
 * intersected with it. A ring seen exactly edge-on is a line, and where on it a
 * drag landed says nothing about an angle.
 *
 * A backstop rather than a rule now: a ring flat enough for this to bite is
 * read on screen instead (`RingMeasure`), long before the plane runs out.
 */
const PLANE_EDGE_ON_THRESHOLD = 0.06;

/**
 * Posing. Only active while `poseMode` is on, which is what keeps it from
 * competing with painting and orbiting for the same drag.
 *
 * Clicking a limb — or its handle — selects it and puts the gizmo on it. From
 * there every pose change goes through one of the gizmo's own handles, and the
 * camera keeps every drag that lands on empty space.
 *
 * There is no freehand drag. A flat pointer movement cannot say which of the
 * infinitely many 3D motions it meant, so a drag on the part itself is not read
 * as a direction — it is read as a *choice of handle*: whichever arrow or ring
 * the pointer fell nearest is the one that moves, lit up under the pointer
 * before the press so the choice is visible rather than guessed at. Grabbing
 * the arrow itself is the same gesture said precisely; grabbing the part is it
 * said quickly. Either way the drag is measured against a direction the user
 * picked, which is what makes the same gesture mean the same thing from every
 * camera angle.
 *
 * Touch reads a press the same way, hover or no hover. It gets no preview of
 * which handle a press stands for, but the choice is made the same way from the
 * same offset, and a finger is far better at finding a limb than a ring the
 * camera has flattened to a sliver. The camera keeps every one-finger drag that
 * starts off the model, and both fingers of every pinch.
 *
 * The active tool picks which gizmo the selected part gets. **Move** puts three
 * arrows on the limb's free end, and dragging one slides that end along that
 * axis alone. **Twist** puts three rings around the joint, and dragging one
 * turns the limb about that axis. Both name the direction before the drag
 * starts, so the same gesture means the same thing from every camera angle.
 *
 * The torso is the exception: it has no joint of its own, so its handle moves
 * the whole model instead — the arrows slide the skin through the scene and the
 * ring turns it on the spot. Both write the sidebar's own move and turn values,
 * not a pose, so the handle and those sliders always show the same number.
 */
export class PoseInputManager {
  private drag: DragState | null = null;
  private hovered: PosePart | null = null;
  private hoveredAxis: PoseAxis | null = null;
  /**
   * The part whose gizmo is showing. Posing is a per-limb job, and a gizmo on
   * every limb at once would be unreadable, so it follows a deliberate
   * selection rather than the pointer.
   */
  private selected: PosePart | null = null;

  constructor(private renderer: MiSkiRenderer) {}

  public mountListeners() {
    const canvas = this.renderer.backend.canvas;
    if (!canvas) return;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerUp);
    window.addEventListener("blur", this.onWindowBlur);
    window.addEventListener("keydown", this.onKeyDown);
  }

  public unmountListeners() {
    const canvas = this.renderer.backend.canvas;
    this.endDrag();
    if (canvas) {
      canvas.removeEventListener("pointerdown", this.onPointerDown);
      canvas.removeEventListener("pointermove", this.onPointerMove);
      canvas.removeEventListener("pointerup", this.onPointerUp);
      canvas.removeEventListener("pointercancel", this.onPointerUp);
    }
    window.removeEventListener("blur", this.onWindowBlur);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  /**
   * The limb the gizmo should light up: the one being dragged, or the one under
   * the pointer. Read by the renderer when it builds the overlay.
   */
  public getHighlightedPart(): PosePart | null {
    return this.drag?.part ?? this.hovered;
  }

  /** The part whose gizmo is on screen. */
  public getSelectedPart(): PosePart | null {
    return this.selected;
  }

  /** The handle being dragged, or the one under the pointer. */
  public getActiveAxis(): PoseAxis | null {
    const drag = this.drag;
    if (!drag) return this.hoveredAxis;
    switch (drag.kind) {
      case "axis":
      case "rotate":
        return drag.axis;
      case "model-move":
        return drag.axisIndex;
      case "model-turn":
        // The model's ring is the upright one, whatever else is on screen.
        return 1;
    }
  }

  /** Drops hover state, e.g. when pose mode is switched off. */
  public clearHover() {
    this.hovered = null;
    this.hoveredAxis = null;
  }

  /** Puts the gizmo away, e.g. when pose mode is switched off. */
  public clearSelection() {
    this.selected = null;
  }

  private onPointerDown = (e: PointerEvent) => {
    // Gated on the gizmo being on screen, not on pose mode alone: while it is
    // hidden (a clip is playing, or a capture is in flight) the handles are
    // still where they were, and grabbing one the user cannot see is worse than
    // having nothing to grab.
    if (!this.renderer.isPoseGizmoVisible()) return;

    const canvas = this.renderer.backend.canvas;
    if (!canvas) return;

    const { x, y } = this.getPointerPos(e);

    // The gizmo first: it is drawn on top of the model, and a handle lying
    // across another limb must not fall through to selecting that limb.
    const axisHandle = this.getAxisHandleAt(x, y, e.pointerType);
    if (axisHandle) {
      const drag = this.beginAxisHandleDrag(axisHandle, e.pointerId, x, y);
      if (drag) {
        this.drag = drag;
        this.startGesture(e, canvas);
        return;
      }
      // A handle with no drag left in it — an arrow pointing straight at the
      // camera — still names its part. Swallowing the press instead would
      // leave a press on something visible doing nothing at all.
      this.selected = axisHandle.part;
      return;
    }

    const handle = this.getHandleAt(x, y, e.pointerType);
    const part = handle?.part ?? this.getPosePartAt(x, y);
    if (!part) {
      // A press on empty space puts the gizmo away, the way clicking off an
      // object deselects it anywhere else.
      this.clearSelection();
      return;
    }

    this.selected = part;

    // Nothing here is dragged freehand. A press on the part — on its mesh, on
    // its centre handle, anywhere — is handed to whichever arrow or ring it
    // fell nearest, the one hover has already lit up. The pointer says which
    // direction is meant; it never says the direction itself.
    //
    // The same on touch, where there is no hover to light it up first. A finger
    // is worse at landing on a ring the camera has flattened to a sliver than a
    // cursor is, so making it land there at all was the wrong thing to ask: the
    // part is the target, it is as big as the limb, and the ring it stands for
    // is the one the finger came down nearest.
    const drag = this.beginNearestAxisHandleDrag(part, e.pointerId, x, y);
    if (!drag) return;
    this.drag = drag;
    this.startGesture(e, canvas);
  };

  /**
   * The drag a press on a part stands in for: the nearest arrow or ring,
   * grabbed where the pointer actually is rather than where that handle happens
   * to run. The offsets both gestures carry are what make that work — an arrow
   * drag measures from where the line was grabbed, a ring drag from the spoke
   * it landed on — so the part holds still until the pointer moves, exactly as
   * it would had the handle itself been hit.
   *
   * Null when the part has no handle to offer, which is the model's own while
   * an environment holds it in place. The press then only selects, and nothing
   * moves that the sidebar would not also refuse to move.
   */
  private beginNearestAxisHandleDrag(
    part: PosePart,
    pointerId: number,
    x: number,
    y: number,
  ): DragState | null {
    const nearest = this.getNearestAxisHandle(x, y, part);
    return nearest ? this.beginAxisHandleDrag(nearest, pointerId, x, y) : null;
  }

  /** The gesture a gizmo handle starts, which is the tool it was built for. */
  private beginAxisHandleDrag(
    handle: PoseAxisHandle,
    pointerId: number,
    x: number,
    y: number,
  ): DragState | null {
    if (handle.part === "body") {
      return handle.kind === "move"
        ? this.beginModelMoveDrag(handle, pointerId, x, y)
        : this.beginModelTurnDrag(handle, pointerId, x, y);
    }
    return handle.kind === "move"
      ? this.beginAxisDrag(handle, handle.part, pointerId, x, y)
      : this.beginRotateDrag(handle, handle.part, pointerId, x, y);
  }

  /** Claims the pointer for the drag that just began. */
  private startGesture(e: PointerEvent, canvas: HTMLCanvasElement) {
    getRendererState().setPoseDragActive(true);
    canvas.setPointerCapture(e.pointerId);
    if (e.pointerType !== "touch") canvas.style.cursor = "grabbing";
    e.preventDefault();
    e.stopPropagation();
  }

  private onPointerMove = (e: PointerEvent) => {
    const drag = this.drag;
    if (!drag || e.pointerId !== drag.pointerId) {
      if (this.renderer.isPoseGizmoVisible()) this.updateHover(e);
      return;
    }

    const { x, y } = this.getPointerPos(e);

    if (!drag.exceededThreshold) {
      if (Math.hypot(x - drag.startX, y - drag.startY) < DRAG_THRESHOLD_PX) {
        return;
      }
      drag.exceededThreshold = true;
      // A ring read on screen counts travel between readings, so the pixels
      // spent proving this was a drag at all must not also be a turn.
      if (
        (drag.kind === "rotate" || drag.kind === "model-turn") &&
        drag.measure.kind === "screen"
      ) {
        drag.measure.lastX = x;
        drag.measure.lastY = y;
      }
    }

    switch (drag.kind) {
      case "axis":
        this.updateAxisDrag(drag, x, y);
        break;
      case "rotate":
        this.updateRotateDrag(drag, x, y);
        break;
      case "model-move":
        this.updateModelMoveDrag(drag, x, y);
        break;
      case "model-turn":
        this.updateModelTurnDrag(drag, x, y);
        break;
    }

    e.preventDefault();
    e.stopPropagation();
  };

  private onPointerUp = (e: PointerEvent) => {
    const drag = this.drag;
    if (!drag || e.pointerId !== drag.pointerId) return;

    const canvas = this.renderer.backend.canvas;
    if (canvas?.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    const moved = drag.exceededThreshold;
    const posed = drag.part !== "body";
    this.endDrag();

    if (moved) {
      // The model transform is already in the store — it has to be, the
      // renderer reads it every frame — so only a pose needs writing back.
      if (posed) this.syncPoseToStore();
      e.preventDefault();
      e.stopPropagation();
    }
  };

  private onWindowBlur = () => {
    if (!this.drag) return;
    const posed = this.drag.part !== "body";
    this.endDrag();
    if (posed) this.syncPoseToStore();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (!this.renderer.isPoseGizmoVisible() || !this.selected) return;
      if (this.drag) return;
      this.clearSelection();
      return;
    }

    // O arms and disarms posing. It lives here rather than in
    // `EditInputManager` because posing is on both the editor and the preview,
    // and only this manager is mounted on both — and O rather than P because
    // the pen already owns that letter, the same second-letter fallback bulk
    // paint takes with U. Leaving pose mode the other way — picking a brush or
    // the eyedropper — needs nothing here: those shortcuts write `paintMode` /
    // `colorPickerActive`, and the store's tool exclusions disarm posing.
    if (e.key !== "o") return;
    // Same guards as the paint shortcuts: no typing contexts, no browser or
    // system combos.
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }
    // Mid-drag the pointer owns the limb; yanking the mode out from under it
    // would strand the drag with no gizmo to finish against.
    if (this.drag) return;
    const state = getRendererState();
    state.setValue("poseMode", !state.poseMode);
  };

  private endDrag() {
    this.drag = null;
    getRendererState().setPoseDragActive(false);
    const canvas = this.renderer.backend.canvas;
    if (canvas) canvas.style.cursor = "default";
  }

  /** Persists the current pose. Called on drag end, not per frame. */
  private syncPoseToStore() {
    getRendererState().setValue("pose", this.renderer.poseSystem.getPose());
  }

  /**
   * Locks a drag to one axis. Everything the solve needs is frozen here: the
   * line the end slides along, and the twist, which is captured once rather
   * than re-derived per move so a long drag cannot let rounding roll the limb.
   */
  private beginAxisDrag(
    handle: PoseMoveHandle,
    part: PoseLimb,
    pointerId: number,
    x: number,
    y: number,
  ): AxisDrag | null {
    const mesh = this.getPartMesh(part);
    if (!mesh || !handle.restOffset) return null;

    const ray = this.getPoseSpaceRay(mesh, x, y);
    if (!ray) return null;

    const grabbed = closestPointOnLine(ray, handle.tipLocal, handle.localAxis);
    if (grabbed === null) return null;

    const rotation = this.renderer.poseSystem.getPartRotation(part);
    const { twist } = swingTwistDecompose(rotation, getPartTwistAxis(part));
    const aimFrom = rotateV3ByQuat(twist, handle.restOffset);
    if (Math.hypot(aimFrom[0], aimFrom[1], aimFrom[2]) < 1e-6) return null;

    return {
      kind: "axis",
      pointerId,
      part,
      axis: handle.axis,
      mesh,
      startX: x,
      startY: y,
      localAxis: handle.localAxis,
      jointLocal: handle.jointLocal,
      tipLocal: handle.tipLocal,
      twist,
      aimFrom,
      // The pointer grabs the arrow somewhere along its shaft, not at the limb's
      // end; carrying that offset keeps the end where it was on the first move.
      grabOffset: grabbed,
      exceededThreshold: false,
    };
  }

  /**
   * Slides the limb's end along the axis the user grabbed.
   *
   * The end cannot actually leave the sphere its joint holds it on, so the
   * point picked out on the axis line is a *target* the limb turns to face.
   * Aiming at it rather than clamping to it keeps the limb tracking smoothly
   * once the target passes out of reach, instead of sticking at arm's length.
   */
  private updateAxisDrag(drag: AxisDrag, x: number, y: number) {
    const ray = this.getPoseSpaceRay(drag.mesh, x, y);
    if (!ray) return;

    const along = closestPointOnLine(ray, drag.tipLocal, drag.localAxis);
    if (along === null) return;

    const distance = along - drag.grabOffset;
    const target: V3 = [
      drag.tipLocal[0] + drag.localAxis[0] * distance - drag.jointLocal[0],
      drag.tipLocal[1] + drag.localAxis[1] * distance - drag.jointLocal[1],
      drag.tipLocal[2] + drag.localAxis[2] * distance - drag.jointLocal[2],
    ];
    if (Math.hypot(target[0], target[1], target[2]) < 1e-6) return;

    const state = getRendererState();
    this.renderer.poseSystem.setPartRotation(
      drag.part,
      multiplyQuat(quatFromUnitVectors(drag.aimFrom, target), drag.twist),
      { snap: state.poseSnap, mirror: state.poseMirror },
    );
  }

  /**
   * Freezes what a ring drag is measured against: the circle's plane and the
   * spoke the pointer landed on, or — when the camera has flattened the ring —
   * the screen direction the sliver runs in.
   */
  private beginRotateDrag(
    handle: PoseTwistHandle,
    part: PoseLimb,
    pointerId: number,
    x: number,
    y: number,
  ): RotateDrag | null {
    const mesh = this.getPartMesh(part);
    if (!mesh) return null;

    const measure = this.ringMeasure(handle, x, y, () =>
      this.getPoseSpaceRay(mesh, x, y),
    );
    if (!measure) return null;

    return {
      kind: "rotate",
      pointerId,
      part,
      axis: handle.axis,
      mesh,
      startX: x,
      startY: y,
      localAxis: handle.localAxis,
      centerLocal: handle.centerLocal,
      measure,
      baseRotation: this.renderer.poseSystem.getPartRotation(part),
      turn: { last: 0, total: 0 },
      exceededThreshold: false,
    };
  }

  /**
   * Which reading a ring about to be dragged will take, and everything that
   * reading needs frozen.
   *
   * The screen reading is tried first and taken only when the ring is too flat
   * on screen for its plane to say anything — so an upright ring keeps the
   * exact under-the-pointer sweep it always had, and the one the camera has
   * squashed to a line, which used to fling or refuse the drag outright, gets a
   * steady one instead of nothing.
   *
   * The ray is fetched lazily because the flattened case never needs it, and it
   * costs a matrix inverse.
   */
  private ringMeasure(
    handle: PoseTwistHandle,
    x: number,
    y: number,
    getRay: () => { origin: V3; direction: V3 } | null,
  ): RingMeasure | null {
    const screen = ringScreenSweep(handle, x, y);
    if (screen) return { kind: "screen", ...screen, lastX: x, lastY: y };

    const ray = getRay();
    if (!ray) return null;
    const grabDirection = ringDirection(
      ray,
      handle.centerLocal,
      handle.localAxis,
    );
    if (!grabDirection) return null;

    return {
      kind: "plane",
      grabDirection,
      minSpoke: RING_ENGAGE_RADIUS_PX * handle.worldPerPixel,
    };
  }

  /**
   * Turns the limb about the ring the user grabbed.
   *
   * The axis arrives already carried through the limb's own rotation, so
   * composing on the left turns the limb in its own frame: an arm held out
   * sideways rolls along the arm. The joint's own limits then decide how much
   * of that turn is a swing and how much a twist.
   */
  private updateRotateDrag(drag: RotateDrag, x: number, y: number) {
    const angle = this.sweep(drag.centerLocal, drag.localAxis, x, y, drag, () =>
      this.getPoseSpaceRay(drag.mesh, x, y),
    );
    if (angle === null) return;

    const state = getRendererState();
    this.renderer.poseSystem.setPartRotation(
      drag.part,
      multiplyQuat(quatFromAxisAngle(drag.localAxis, angle), drag.baseRotation),
      { snap: state.poseSnap, mirror: state.poseMirror },
    );
  }

  /**
   * Freezes what a whole-model slide is measured against: where the model sat,
   * where the handle is, and where along the arrow the pointer landed.
   */
  private beginModelMoveDrag(
    handle: PoseMoveHandle,
    pointerId: number,
    x: number,
    y: number,
  ): ModelMoveDrag | null {
    if (isModelMoveLocked()) return null;

    const ray = this.getSceneRay(x, y);
    if (!ray) return null;

    const along = closestPointOnLine(ray, handle.tipLocal, handle.localAxis);
    if (along === null) return null;

    return {
      kind: "model-move",
      pointerId,
      part: "body",
      startX: x,
      startY: y,
      baseOffset: getModelTranslation(),
      anchor: handle.tipLocal,
      axis: handle.localAxis,
      axisIndex: handle.axis,
      grabAlong: along,
      exceededThreshold: false,
    };
  }

  /**
   * Slides the model to wherever the pointer has taken the handle.
   *
   * The offset is rebuilt from where the drag began rather than accumulated per
   * move, so a value that clamps at the end of its range walks straight back
   * out when the pointer comes back — the same reason the joint drags do it.
   */
  private updateModelMoveDrag(drag: ModelMoveDrag, x: number, y: number) {
    const ray = this.getSceneRay(x, y);
    if (!ray) return;

    const along = closestPointOnLine(ray, drag.anchor, drag.axis);
    if (along === null) return;

    const distance = along - drag.grabAlong;
    setModelTranslation(
      [
        drag.baseOffset[0] + drag.axis[0] * distance,
        drag.baseOffset[1] + drag.axis[1] * distance,
        drag.baseOffset[2] + drag.axis[2] * distance,
      ],
      { snap: getRendererState().poseSnap },
    );
  }

  private beginModelTurnDrag(
    handle: PoseTwistHandle,
    pointerId: number,
    x: number,
    y: number,
  ): ModelTurnDrag | null {
    const measure = this.ringMeasure(handle, x, y, () =>
      this.getSceneRay(x, y),
    );
    if (!measure) return null;

    return {
      kind: "model-turn",
      pointerId,
      part: "body",
      startX: x,
      startY: y,
      axis: handle.localAxis,
      center: handle.centerLocal,
      measure,
      baseAngle: getModelTurn(),
      turn: { last: 0, total: 0 },
      exceededThreshold: false,
    };
  }

  /**
   * Turns the model on the spot, by the angle the pointer has swept around its
   * ring. Solved in scene space, outside the model's own turn, because that is
   * the value being written.
   */
  private updateModelTurnDrag(drag: ModelTurnDrag, x: number, y: number) {
    const angle = this.sweep(drag.center, drag.axis, x, y, drag, () =>
      this.getSceneRay(x, y),
    );
    if (angle === null) return;

    setModelTurn(drag.baseAngle + angle, {
      snap: getRendererState().poseSnap,
    });
  }

  /**
   * How far a ring drag has swept since it began, in radians.
   *
   * Accumulated between readings rather than taken straight from the current
   * spoke, because an angle around a circle only reads back as half a turn
   * either way: without this, carrying a drag past that point would snap the
   * part round to the other side.
   */
  private sweep(
    center: V3,
    axis: V3,
    x: number,
    y: number,
    drag: { measure: RingMeasure; turn: TurnTracker },
    getRay: () => { origin: V3; direction: V3 } | null,
  ): number | null {
    const { measure, turn } = drag;

    if (measure.kind === "screen") {
      // Travel along the sliver, at the rate the ring turns at when it is
      // round. Counted between readings rather than from where the drag began,
      // so it can wind on past the ends of the sliver and keep going.
      turn.total +=
        ((x - measure.lastX) * measure.direction.x +
          (y - measure.lastY) * measure.direction.y) /
        measure.pixelsPerRadian;
      measure.lastX = x;
      measure.lastY = y;
      return turn.total;
    }

    const ray = getRay();
    if (!ray) return null;
    const spoke = ringSpoke(ray, center, axis);
    if (!spoke) return null;

    // Still inside the dead centre: the drag has not begun, so the grab follows
    // the pointer out rather than measuring an angle that means nothing yet.
    if (spoke.length < measure.minSpoke) {
      measure.grabDirection = spoke.direction;
      turn.last = 0;
      return null;
    }

    const angle = signedAngle(measure.grabDirection, spoke.direction, axis);
    let step = angle - turn.last;
    if (step > Math.PI) step -= Math.PI * 2;
    else if (step < -Math.PI) step += Math.PI * 2;

    turn.last = angle;
    turn.total += step;
    return turn.total;
  }

  /**
   * The pointer ray in scene space — outside the model's own transform, which
   * is exactly the space the move offsets are applied in.
   */
  private getSceneRay(
    x: number,
    y: number,
  ): { origin: V3; direction: V3 } | null {
    const canvas = this.renderer.backend.canvas;
    if (!canvas) return null;

    return computeRay(
      x,
      y,
      canvas.width,
      canvas.height,
      this.renderer.backend.getProjectTransformation(),
      this.renderer.backend.getViewTransformation(),
      identityM44(),
    );
  }

  /** The pointer ray, carried into the space the part's rotation acts in. */
  private getPoseSpaceRay(
    mesh: MinecraftPart,
    x: number,
    y: number,
  ): { origin: V3; direction: V3 } | null {
    const canvas = this.renderer.backend.canvas;
    const parent = getPoseSpace(mesh);
    if (!canvas || !parent) return null;

    const ray = computeRay(
      x,
      y,
      canvas.width,
      canvas.height,
      this.renderer.backend.getProjectTransformation(),
      this.renderer.backend.getViewTransformation(),
      this.renderer.backend.getGlobalTransformation(),
    );

    const invParent = inverse(parent.getTransformMatrix());
    return {
      origin: multiplyM4V3(invParent, ray.origin),
      direction: normalize(
        multiplyM4V3(rotationOnly(invParent), ray.direction),
      ),
    };
  }

  private updateHover(e: PointerEvent) {
    const { x, y } = this.getPointerPos(e);

    const axisHandle = this.getAxisHandleAt(x, y, e.pointerType);
    const handle = axisHandle ? null : this.getHandleAt(x, y, e.pointerType);
    this.hovered = axisHandle
      ? axisHandle.part
      : (handle?.part ??
        (e.pointerType === "touch" ? null : this.getPosePartAt(x, y)));

    // Anywhere else on the part — its handle, its mesh — the arrow or ring the
    // pointer leans towards lights up as though it were being hovered directly,
    // because a press there will grab exactly that. Lighting it *before* the
    // press is the whole point: the part alone could stand for any of the
    // three, and the highlight is what says which one, while there is still
    // time to lean the other way.
    //
    // Only for the part already selected, since those are the handles on
    // screen: lighting an axis for a limb whose gizmo has not arrived yet would
    // dim two arrows belonging to the limb the user is still looking at.
    this.hoveredAxis =
      axisHandle?.axis ??
      (this.hovered && this.hovered === this.selected
        ? (this.getNearestAxisHandle(x, y, this.hovered)?.axis ?? null)
        : null);

    if (e.pointerType === "touch") return;
    const canvas = this.renderer.backend.canvas;
    // One cursor for all of it, because there is now only one gesture: grab an
    // arrow or a ring — named outright, or by leaning towards it.
    if (canvas) {
      canvas.style.cursor = this.hovered ? "grab" : "default";
    }
  }

  /**
   * The arrow or ring nearest the pointer, out of the ones `part` would show.
   *
   * Computed for the part asked about rather than the selected one, so a press
   * on an unselected limb's handle can be handed to a handle that is only about
   * to appear — the same one the user will see under the pointer the instant
   * the gizmo lands there.
   */
  private getNearestAxisHandle(
    x: number,
    y: number,
    part: PosePart,
  ): PoseAxisHandle | null {
    return findNearestAxisHandle(computeAxisHandles(this.renderer, part), x, y);
  }

  /** The gizmo handle under the pointer. Only the selected part has any. */
  private getAxisHandleAt(
    x: number,
    y: number,
    pointerType: string,
  ): PoseAxisHandle | null {
    const canvas = this.renderer.backend.canvas;
    if (!canvas || !this.selected) return null;
    return findAxisHandleAt(
      computeAxisHandles(this.renderer, this.selected),
      x,
      y,
      pointerType === "touch"
        ? AXIS_GRAB_SLOP_PX.touch
        : AXIS_GRAB_SLOP_PX.mouse,
      canvas.width / (canvas.clientWidth || canvas.width),
    );
  }

  private getHandleAt(
    x: number,
    y: number,
    pointerType: string,
  ): PoseHandle | null {
    const canvas = this.renderer.backend.canvas;
    if (!canvas) return null;
    return findHandleAt(
      computePoseHandles(this.renderer),
      x,
      y,
      pointerType === "touch"
        ? HANDLE_GRAB_SLOP_PX.touch
        : HANDLE_GRAB_SLOP_PX.mouse,
      canvas.width / (canvas.clientWidth || canvas.width),
    );
  }

  private getPosePartAt(x: number, y: number): PosePart | null {
    const hit = this.renderer.getMeshHitAt(x, y);
    if (!hit) return null;
    const part = hit.mesh.metadata.part;
    if (typeof part !== "string" || !isPosePart(part)) return null;
    return part;
  }

  private getPointerPos(e: PointerEvent): { x: number; y: number } {
    const canvas = this.renderer.backend.canvas;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - rect.left) * (canvas.width / rect.width)),
      y: Math.floor((e.clientY - rect.top) * (canvas.height / rect.height)),
    };
  }

  private getPartMesh(part: PosePart): MinecraftPart | null {
    return resolvePosePartMesh(
      this.renderer.getMainSkin(),
      part,
      getRendererState().skinIsPocket,
    );
  }
}

/**
 * How far along an axis line the pointer ray comes closest to it — the standard
 * closest-approach solve between two lines, which is what turns a 2D pointer
 * position into one number along a direction the user already chose.
 *
 * Null when the two are near enough parallel that no answer means anything.
 */
function closestPointOnLine(
  ray: { origin: V3; direction: V3 },
  point: V3,
  axis: V3,
): number | null {
  const w = subtractV3(point, ray.origin);
  const b = dot(axis, ray.direction);
  const denominator = 1 - b * b;
  if (Math.abs(denominator) < AXIS_PARALLEL_THRESHOLD) return null;

  const along = (b * dot(ray.direction, w) - dot(axis, w)) / denominator;
  return Number.isFinite(along) ? along : null;
}

/**
 * Where the pointer ray meets a plane, or null when the two are near enough
 * parallel that no answer would mean anything.
 */
function rayPlanePoint(
  ray: { origin: V3; direction: V3 },
  point: V3,
  normal: V3,
): V3 | null {
  const denominator = dot(ray.direction, normal);
  if (Math.abs(denominator) < PLANE_EDGE_ON_THRESHOLD) return null;

  const t = dot(subtractV3(point, ray.origin), normal) / denominator;
  if (!Number.isFinite(t)) return null;

  return [
    ray.origin[0] + ray.direction[0] * t,
    ray.origin[1] + ray.direction[1] * t,
    ray.origin[2] + ray.direction[2] * t,
  ];
}

/**
 * Where the pointer ray meets a ring's plane, as a unit spoke from its centre —
 * the direction the drag is currently holding. Null when the ring is too close
 * to edge-on for that point to mean anything, or when the pointer is dead on
 * the centre, where no direction exists.
 */
function ringDirection(
  ray: { origin: V3; direction: V3 },
  center: V3,
  axis: V3,
): V3 | null {
  return ringSpoke(ray, center, axis)?.direction ?? null;
}

/** The same spoke, with the distance out to it kept: how far the grab is from
 * the centre is what says whether its direction can be trusted. */
function ringSpoke(
  ray: { origin: V3; direction: V3 },
  center: V3,
  axis: V3,
): { direction: V3; length: number } | null {
  const hit = rayPlanePoint(ray, center, axis);
  if (!hit) return null;

  const offset = subtractV3(hit, center);
  const length = Math.hypot(offset[0], offset[1], offset[2]);
  if (length < 1e-6) return null;

  return {
    direction: [offset[0] / length, offset[1] / length, offset[2] / length],
    length,
  };
}

/** The angle from one spoke to another, signed about the ring's own axis. */
function signedAngle(from: V3, to: V3, axis: V3): number {
  return Math.atan2(dot(cross(from, to), axis), dot(from, to));
}

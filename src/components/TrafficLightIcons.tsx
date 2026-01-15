import {
  unfocused,
  closeDefault,
  closeHover,
  closeActive,
  minimizeDefault,
  minimizeHover,
  minimizeActive,
  maximizeDefault,
  maximizeHover,
  maximizeActive,
} from 'macos-traffic-lights';

export const TrafficLightUnfocusedSVG = () => (
  <img src={unfocused} alt="unfocused" className="w-full h-full" />
);

export const CloseNormalSVG = () => (
  <img src={closeDefault} alt="close" className="w-full h-full" />
);

export const CloseHoverSVG = () => (
  <img src={closeHover} alt="close" className="w-full h-full" />
);

export const ClosePressedSVG = () => (
  <img src={closeActive} alt="close" className="w-full h-full" />
);

export const MinimizeNormalSVG = () => (
  <img src={minimizeDefault} alt="minimize" className="w-full h-full" />
);

export const MinimizeHoverSVG = () => (
  <img src={minimizeHover} alt="minimize" className="w-full h-full" />
);

export const MinimizePressedSVG = () => (
  <img src={minimizeActive} alt="minimize" className="w-full h-full" />
);

export const MaximizeNormalSVG = () => (
  <img src={maximizeDefault} alt="maximize" className="w-full h-full" />
);

export const MaximizeHoverSVG = () => (
  <img src={maximizeHover} alt="maximize" className="w-full h-full" />
);

export const MaximizePressedSVG = () => (
  <img src={maximizeActive} alt="maximize" className="w-full h-full" />
);

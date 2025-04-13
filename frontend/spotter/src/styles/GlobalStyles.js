import { createGlobalStyle } from "styled-components";
import { device } from "./media";

export const GlobalStyle = createGlobalStyle`
  body {
    font-size: 16px;

    @media ${device.mobile} {
      font-size: 14px;
    }

    /* @media print {
  canvas {
    width: 100% !important;
    height: auto !important;
  }

  .chartjs-size-monitor,
  .chartjs-render-monitor {
    width: 100% !important;
    height: auto !important;
  } */
/* } */

  }
`;

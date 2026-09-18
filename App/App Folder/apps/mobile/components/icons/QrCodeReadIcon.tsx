import React from 'react';
import Svg, { Path, Rect, Line } from 'react-native-svg';

interface QrCodeReadIconProps {
  size?: number;
  color?: string;
}

/**
 * FontAwesome-inspired fa-qrcode-read icon
 * <i class="fa-sharp-duotone fa-regular fa-qrcode-read"></i>
 */
export const QrCodeReadIcon: React.FC<QrCodeReadIconProps> = ({
  size = 24,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 4 Corner Viewfinder Brackets */}
      <Path
        d="M3 8V5.5C3 4.67 3.67 4 4.5 4H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 4h2.5c.83 0 1.5.67 1.5 1.5V8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 16v2.5c0 .83.67 1.5 1.5 1.5H7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 20h2.5c.83 0 1.5-.67 1.5-1.5V16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* QR Finder Squares */}
      {/* Top Left Finder */}
      <Rect
        x="6"
        y="6"
        width="3.5"
        height="3.5"
        rx="0.5"
        fill={color}
      />
      {/* Top Right Finder */}
      <Rect
        x="14.5"
        y="6"
        width="3.5"
        height="3.5"
        rx="0.5"
        fill={color}
      />
      {/* Bottom Left Finder */}
      <Rect
        x="6"
        y="14.5"
        width="3.5"
        height="3.5"
        rx="0.5"
        fill={color}
      />
      {/* Bottom Right Data Dots */}
      <Rect
        x="14.5"
        y="14.5"
        width="2"
        height="2"
        rx="0.3"
        fill={color}
      />
      <Rect
        x="17"
        y="17"
        width="1.8"
        height="1.8"
        rx="0.3"
        fill={color}
      />

      {/* Horizontal Laser Scanning Line */}
      <Line
        x1="2.5"
        y1="12"
        x2="21.5"
        y2="12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

import React, { useEffect, useState } from "react";

const MobileScrollDown = () => {
  return (
    <div className="scroll-down-mobile">
      <span></span>
    </div>
  );
};

const DesktopScrollDown = () => {
  return (
    <div className="scroll-down-desktop">
      <span></span>
    </div>
  );
};

function ScrollDown() {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width:1200px)").matches
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.matchMedia("(max-width:1200px)").matches);
    });
  });
  return <>{isMobile ? <MobileScrollDown /> : <DesktopScrollDown />}</>;
}

export default ScrollDown;

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
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width:1200px)").matches);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <>{isMobile ? <MobileScrollDown /> : <DesktopScrollDown />}</>;
}

export default ScrollDown;

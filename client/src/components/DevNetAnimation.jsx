import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const DevNetAnimation = () => {
  const devRef = useRef(null);
  const netRef = useRef(null);
  const removeRef1 = useRef(null);
  const removeRef2 = useRef(null);

  useEffect(() => {
    // Create a timeline for smoother, sequential animations
    const tl = gsap.timeline();

    // First, fade out "elopers" and "work"
    tl.to([removeRef1.current, removeRef2.current], {
      opacity: 0,
      duration: 0.5, // Longer duration for a smoother fade
      ease: "power2.out",
    });

    // After fading out, move "Dev" and "Net" closer together
    tl.to([devRef.current, netRef.current], {
      x: (i, target) => (target === devRef.current ? 230 : -100), // Moves 'Dev' right and 'Net' left
      duration: 0.5, // Smooth duration for movement
      ease: "power2.out",
    });

    // Smooth blink effect after the movement
    tl.to([devRef.current, netRef.current], {
      opacity: 0,
      yoyo: true,  // Alternates between fade out and fade in
      repeat: -1,  // Infinite blinking
      duration: 0.5, // Speed of the blink
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <h1 className="text-white text-4xl md:text-[6rem] font-bold">
        <span ref={devRef} className="inline-block">
          Dev
        </span>
        <span ref={removeRef1} className="inline-block">
          elopers
        </span>{" "}
        <span ref={netRef} className="inline-block">
          Net
        </span>
        <span ref={removeRef2} className="inline-block">
          work
        </span>
      </h1>
    </div>
  );
};

export default DevNetAnimation;

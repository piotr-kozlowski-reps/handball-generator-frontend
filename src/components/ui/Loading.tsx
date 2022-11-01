import React, { Fragment, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import { gsap } from "gsap";
import { TbBallVolleyball } from "react-icons/tb";

import Backdrop from "./Backdrop";

const ModalOverlay = () => {
  const iconRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(iconRef.current, {
        y: 30,
        scaleY: 0.85,
        scaleX: 1.1,
        duration: 0.4,
        yoyo: true,
        repeat: -1,
        ease: "power4.uut",
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="z-max opacity-100 fixed">
      <div className="flex justify-center items-center w-screen h-screen ">
        <div ref={iconRef}>
          <span className="text-3xl text-black">
            <TbBallVolleyball />
          </span>
        </div>
      </div>
    </div>,
    document.getElementById("loading-hook")!
  );
};

const Loading = () => {
  return (
    <Fragment>
      <Backdrop />
      <ModalOverlay />
    </Fragment>
  );
};

export default Loading;

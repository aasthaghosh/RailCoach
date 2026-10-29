import React from "react";

const AnimatedMenuButton = ({ text = "Assign Task", onClick }) => {
  return (
    <>
      <div className="button-container">
        <span className="mask-text">{text}</span>
        <button onClick={onClick}>{text}</button>
      </div>

      <style>{`
/* ================= MASK BUTTON ================= */

.button-container {
  position: relative;
  width: 160px;
  height: 48px;
  margin: 0px;
  overflow: hidden;
  border: 1px solid #000;
  border-radius: 8px;
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
}

/* Visible text */
.mask-text {
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 48px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #000;
  z-index: 2;
  pointer-events: none;
}

/* Button */
.button-container button {
  width: 101%;
  height: 100%;
  border: none;
  background: #b6b6b9;
  color: #b6b6b9;
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 1px;

  /* MASK */
  -webkit-mask-image: url("https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png");
  mask-image: url("https://raw.githubusercontent.com/robin-dela/css-mask-animation/master/img/nature-sprite.png");
  -webkit-mask-size: 2300% 100%;
  mask-size: 2300% 100%;
  -webkit-mask-position: 100% 0;
  mask-position: 100% 0;

  animation: mask-out 0.7s steps(22) forwards;
}

/* Hover animation */
.button-container button:hover {
  animation: mask-in 0.9s steps(22) forwards;
}

/* ================= ANIMATIONS ================= */

@keyframes mask-in {
  from {
    -webkit-mask-position: 0 0;
            mask-position: 0 0;
  }
  to {
    -webkit-mask-position: 100% 0;
            mask-position: 100% 0;
  }
}

@keyframes mask-out {
  from {
    -webkit-mask-position: 100% 0;
            mask-position: 100% 0;
  }
  to {
    -webkit-mask-position: 0 0;
            mask-position: 0 0;
  }
}
      `}</style>
    </>
  );
};



export default AnimatedMenuButton;

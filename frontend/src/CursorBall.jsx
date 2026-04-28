import { useEffect, useRef } from "react";

export default function CursorBall() {
  const ballRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const ball = ballRef.current;
    const label = labelRef.current;

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    const speed = 0.15; // smoothness (lower = more lag)

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      if (ball) {
        ball.style.left = currentX + "px";
        ball.style.top = currentY + "px";
      }

      requestAnimationFrame(animate);
    };

    animate();

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const hoverOn = () => {
      ball.classList.add("active");
      if (label) label.textContent = "VIEW";
    };

    const hoverOff = () => {
      ball.classList.remove("active");
      if (label) label.textContent = "";
    };

    document.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("button, a, .hover-target");

    targets.forEach((el) => {
      el.addEventListener("mouseenter", hoverOn);
      el.addEventListener("mouseleave", hoverOff);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", hoverOn);
        el.removeEventListener("mouseleave", hoverOff);
      });
    };
  }, []);

  return (
    <div
      ref={ballRef}
      className="cursor-ball flex items-center justify-center"
    >
      <span
        ref={labelRef}
        className="text-xs font-semibold tracking-wider pointer-events-none"
      />
    </div>
  );
}
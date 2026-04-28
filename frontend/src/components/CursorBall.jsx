import { useEffect } from "react";

export default function CursorBall() {
  useEffect(() => {
    const ball = document.createElement("div");
    ball.className = "cursor-ball";
    document.body.appendChild(ball);

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;

    // Smooth follow (lag effect)
    const speed = 0.15;

    const animate = () => {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;

      ball.style.left = currentX + "px";
      ball.style.top = currentY + "px";

      requestAnimationFrame(animate);
    };

    animate();

    const move = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const hoverOn = () => ball.classList.add("active");
    const hoverOff = () => ball.classList.remove("active");

    document.addEventListener("mousemove", move);

    document.querySelectorAll("button, a, .sidebar-item").forEach(el => {
      el.addEventListener("mouseenter", hoverOn);
      el.addEventListener("mouseleave", hoverOff);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      ball.remove();
    };
  }, []);

  return null;
}

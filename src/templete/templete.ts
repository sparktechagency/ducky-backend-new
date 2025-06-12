export const successTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Successful</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #e8f5e9;
      }

      .container {
        text-align: center;
        padding: 2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 128, 0, 0.2);
        max-width: 500px;
        width: 90%;
      }

      .success-icon {
        font-size: 4rem;
        color: #4caf50;
        margin-bottom: 1rem;
      }

      h1 {
        color: #2e7d32;
        margin-bottom: 1rem;
      }

      p {
        color: #388e3c;
        margin-bottom: 2rem;
      }

      .btn-home {
        display: inline-block;
        padding: 0.5rem 1.5rem;
        color: #fff;
        background-color: #4caf50;
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      .btn-home:hover {
        background-color: #388e3c;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="success-icon">✔️</div>
      <h1>Thank You for Your Payment!</h1>
      <p>Your transaction was successful.</p>
      <a href="http://10.0.70.35:8020/" class="btn-home"
        >Return to Home</a
      >
    </div>
  </body>
</html>`;

export const serverRunningTemplete = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Oops, Server is Actually a Supernova!</title>
    <style>
      /* All your previous styles remain unchanged */

      @keyframes rotateGradient {
        0% {
          transform: rotate(0deg);
          opacity: 0.7;
        }
        50% {
          opacity: 1;
        }
        100% {
          transform: rotate(360deg);
          opacity: 0.7;
        }
      }

      @keyframes colorShift {
        0% {
          filter: hue-rotate(0deg);
        }
        100% {
          filter: hue-rotate(360deg);
        }
      }

      @keyframes glowText {
        0%,
        100% {
          text-shadow:
            0 0 20px #00ffea,
            0 0 40px #00ffea,
            0 0 80px #00ffd5,
            0 0 120px #00ffd5;
          color: #00ffe0;
          transform: scale(1);
        }
        50% {
          text-shadow:
            0 0 60px #00ffd5,
            0 0 100px #00ffd5,
            0 0 140px #00ffd5;
          color: #00fff5;
          transform: scale(1.05);
        }
      }

      @keyframes pulseBounce {
        0%,
        100% {
          transform: scale(1) translateY(0);
        }
        50% {
          transform: scale(1.1) translateY(-10px);
        }
      }

      @keyframes pulseRing {
        0%,
        100% {
          box-shadow:
            0 0 25px #00ff00,
            0 0 40px #ffff00,
            0 0 60px #00ff00;
        }
        50% {
          box-shadow:
            0 0 50px #ffff00,
            0 0 70px #00ff00,
            0 0 100px #ffff00;
        }
      }

      /* Floating particles */
      @keyframes floatParticles {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0.7;
        }
        50% {
          transform: translateY(-20px) translateX(15px);
          opacity: 1;
        }
        100% {
          transform: translateY(0) translateX(0);
          opacity: 0.7;
        }
      }

      body {
        margin: 0;
        height: 100vh;
        background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Orbitron', sans-serif;
        text-align: center;
        overflow: hidden;
        color: #00ffe0;
        position: relative;
      }

      /* Ambient floating particles */
      .particle {
        position: absolute;
        border-radius: 50%;
        background: #00ffe0;
        opacity: 0.7;
        filter: blur(3px);
        animation: floatParticles 6s ease-in-out infinite;
      }

      .particle:nth-child(1) {
        width: 12px;
        height: 12px;
        top: 15%;
        left: 20%;
        animation-delay: 0s;
      }
      .particle:nth-child(2) {
        width: 8px;
        height: 8px;
        top: 30%;
        left: 75%;
        animation-delay: 2s;
      }
      .particle:nth-child(3) {
        width: 10px;
        height: 10px;
        top: 60%;
        left: 40%;
        animation-delay: 4s;
      }
      .particle:nth-child(4) {
        width: 6px;
        height: 6px;
        top: 80%;
        left: 65%;
        animation-delay: 3s;
      }
      .particle:nth-child(5) {
        width: 14px;
        height: 14px;
        top: 50%;
        left: 10%;
        animation-delay: 1s;
      }

      /* Wrapper to hold container and animated glowing ring */
      .container-wrapper {
        position: relative;
        width: 640px;
        height: 640px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Pulsating glow behind container */
      .glow-pulse {
        position: absolute;
        inset: -40px;
        border-radius: 50%;
        background: radial-gradient(circle at center, #00ff00, transparent 70%);
        animation: pulseRing 4s ease-in-out infinite;
        filter: blur(40px);
        z-index: 0;
      }

      /* The glowing ring that rotates behind the container with color shift */
      .glowing-ring {
        position: absolute;
        inset: -20px;
        border-radius: 50%;
        padding: 20px;
        background: conic-gradient(
          from 0deg,
          #00ff00,
          #ffff00,
          #00ff00,
          #ffff00,
          #00ff00
        );
        animation:
          rotateGradient 6s linear infinite,
          colorShift 20s linear infinite;
        -webkit-mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 20px),
          black calc(100% - 19px)
        );
        mask: radial-gradient(
          farthest-side,
          transparent calc(100% - 20px),
          black calc(100% - 19px)
        );
        z-index: 1;
        filter: drop-shadow(0 0 25px #00ff00) drop-shadow(0 0 40px #ffff00)
          drop-shadow(0 0 60px #00ff00);
        opacity: 0.8;
      }

      /* The circular container */
      .container {
        position: relative;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.75);
        box-sizing: border-box;
        padding: 50px;
        z-index: 2;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        user-select: none;
      }

      .icon {
        font-size: 140px;
        margin-bottom: 20px;
        animation:
          glowText 3s ease-in-out infinite,
          pulseBounce 3s ease-in-out infinite;
        will-change: transform, text-shadow;
      }

      h1 {
        font-size: 4rem;
        margin: 0;
        letter-spacing: 0.1em;
        animation: glowText 4s ease-in-out infinite;
        will-change: text-shadow, transform;
      }

      p {
        font-size: 1.5rem;
        font-weight: 400;
        color: #a0fff5cc;
        margin: 0 20px;
        line-height: 1.5;
      }

      /* New copyright line fixed bottom right */
      .copyright {
        position: fixed;
        bottom: 15px;
        right: 15px;
        font-size: 0.9rem;
        color: #40ffb0cc;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        user-select: none;
        pointer-events: none;
        z-index: 9999;
        filter: drop-shadow(0 0 2px #00ffb0);
      }
    </style>
    <link
      href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <!-- Floating ambient particles -->
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>

    <div class="container-wrapper">
      <div class="glow-pulse"></div>
      <div class="glowing-ring"></div>
      <div class="container">
        <div class="icon">⚡</div>
        <h1>Server is Running</h1>
        <p>
          Everything is online and fully operational. Ready for your requests!
        </p>
      </div>
    </div>

    <div class="copyright">
      <p>© Powered By Humayon Forid</p>
    </div>
  </body>
</html>
`;

export const successAccountTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Success</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        font-family: "Poppins", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f8f8;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }

      .container {
        text-align: center;
        background-color: #ffffff;
        padding: 40px 60px;
        border-radius: 10px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        width: 400px;
      }

      .checkmark {
        font-size: 80px;
        color: #4caf50;
      }

      h1 {
        font-size: 28px;
        color: #333;
        margin-top: 20px;
      }

      p {
        font-size: 18px;
        color: #555;
        margin: 10px 0;
      }

      .btn {
        background-color: #4caf50;
        color: #fff;
        font-size: 16px;
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        margin-top: 20px;
      }

      .btn:hover {
        background-color: #45a049;
      }

      .footer {
        font-size: 14px;
        color: #aaa;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="checkmark">✔</div>
      <h1>Account Added Successfully!</h1>
      <p>
        Thank you for adding your account now you can be able to receive payment
        from the
      </p>
      <!-- <a href="/" class="btn">Go to Home</a> -->
      <div class="footer">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </div>
    </div>
  </body>
</html>`;

export const cancelTemplete = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Failed</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-family: Arial, sans-serif;
        background-color: #fdecea; /* Light red background */
      }

      .container {
        text-align: center;
        padding: 2rem;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
      }

      .error-icon {
        font-size: 4rem;
        color: #e53935; /* Red color for error icon */
        margin-bottom: 1rem;
      }

      h1 {
        color: #d32f2f; /* Darker red for the heading */
        margin-bottom: 1rem;
      }

      p {
        color: #c62828; /* Medium red for text */
        margin-bottom: 2rem;
      }

      .btn-home {
        display: inline-block;
        padding: 0.5rem 1.5rem;
        color: #fff;
        background-color: #e53935; /* Red button */
        text-decoration: none;
        border-radius: 5px;
        transition: background-color 0.3s;
      }

      .btn-home:hover {
        background-color: #c62828; /* Darker red on hover */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="error-icon">❌</div>
      <h1>Payment Failed</h1>
      <p>Unfortunately, your transaction could not be completed.</p>
      <a href="/" class="btn-home">Return to Home</a>
    </div>
  </body>
</html>`;
<span class="loader"></span>

<style>
  .loader {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
    background: linear-gradient(
      165deg,
      rgba(255, 255, 255, 1) 0%,
      rgb(220, 220, 220) 40%,
      rgb(170, 170, 170) 98%,
      rgb(10, 10, 10) 100%
    );
  }

  .loader:before {
    content: "";
    width: 100%;
    height: 100%;
    filter: blur(3px);
    position: absolute;
    border-radius: 100%;
    border-bottom: 0 solid #ffffff05;
    animation: 2s rotate linear infinite;
    box-shadow:
      0 -10px 20px 20px #ffffff40 inset,
      0 -5px 15px 10px #ffffff50 inset,
      0 -2px 5px #ffffff80 inset,
      0 -3px 2px #ffffffbb inset,
      0 2px 0px #ffffff,
      0 2px 3px #ffffff,
      0 5px 5px #ffffff90,
      0 10px 15px #ffffff60,
      0 10px 20px 20px #ffffff40;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
</style>

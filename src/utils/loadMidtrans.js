export const loadMidtransSnap = () => {
    return new Promise((resolve, reject) => {
      if (window.snap) return resolve();
  
      const script = document.createElement("script");
      script.src =
        import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === "true"
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js";
  
      script.setAttribute(
        "data-client-key",
        import.meta.env.VITE_MIDTRANS_CLIENT_KEY
      );
  
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Midtrans Snap"));
  
      document.body.appendChild(script);
    });
  };
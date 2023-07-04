// const btn = document.querySelector(".changeColorBtn");

// btn.addEventListener("click", async () => {
//   // console.log("clicked");
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // console.log(tab);

//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: () => {
//       console.log("script1 Working");
//       pickColor();
//     },
//   });
// });

// async function pickColor() {
//   // console.log("script Working");
//   try {
//     //picker
//     const eyeDropper = new EyeDropper();
//     const selecteColor = await eyeDropper.open();
//     console.log(selecteColor);
//   } catch (err) {
//     console.error(err);
//   }
// }

const btn = document.querySelector(".changeColorBtn");
const colorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

btn.addEventListener("click", async () => {
  chrome.storage.sync.get("color", function ({ color }) {
    console.log("color : ", color);
  });
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorGrid.style.backgroundColor = color;
        colorValue.innerText = color;
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    // Picker
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.error(err);
  }
}

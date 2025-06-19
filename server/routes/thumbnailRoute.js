import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/thumbnail", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await axios.post(
            "https://api.together.xyz/v1/images/generations",
            {
                prompt,
                model: "black-forest-labs/FLUX.1-schnell-Free",
                
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 60000,
            }
        );
        const imageUrl = response.data.data[0].url;
        // console.log("Generated image URL:", imageUrl);

        res.json({ imageUrl });
    } catch (err) {
        console.error("Together Flux error:", err.response?.data || err.message);
        res.status(500).json({ error: "Image generation failed" });
    }
});

// router.get("/download-thumbnail", async (req, res) => {
//   const { url } = req.query;

//   if (!url) return res.status(400).send("Missing image URL");

//   try {
//     const response = await axios.get(url, { responseType: "arraybuffer" });

//     const contentType = response.headers["content-type"];
//     console.log("Image content type:", contentType);

//     if (!contentType.startsWith("image/")) {
//       return res.status(400).send("Invalid image format");
//     }

//     const extension = contentType.split("/")[1] || "jpeg";

//     res.setHeader("Content-Disposition", `attachment; filename=thumbnail.${extension}`);
//     res.setHeader("Content-Type", contentType);
//     res.send(response.data);
//   } catch (error) {
//     console.error("Backend download error:");
//     if (error.response) {
//       console.error("Status:", error.response.status);
//       console.error("Data:", error.response.data?.slice?.(0, 300)); // Log first 300 chars if HTML
//     } else {
//       console.error(error.message);
//     }

//     res.status(500).send("Failed to download image");
//   }
// });



export default router;

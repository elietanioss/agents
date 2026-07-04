#!/usr/bin/env python3
"""
Vertex AI Imagen 4 image generation script.
Usage: python generate-image.py "prompt" --output ./image.png --ratio 1:1

Requires:
  - GOOGLE_APPLICATION_CREDENTIALS env var pointing to D:\keys\vertex-key.json
  - pip install google-cloud-aiplatform
"""

import argparse
import base64
import os
import sys

RATIO_MAP = {
    "1:1":  "1:1",
    "3:4":  "3:4",
    "4:3":  "4:3",
    "16:9": "16:9",
    "9:16": "9:16",
}

PROJECT_ID = "gen-lang-client-0015608199"
LOCATION   = "us-central1"
MODEL_ID   = "imagen-4.0-generate-001"


def generate(prompt: str, output: str, ratio: str) -> None:
    try:
        import vertexai
        from vertexai.preview.vision_models import ImageGenerationModel
    except ImportError:
        print("ERROR: google-cloud-aiplatform not installed.")
        print("Run: pip install google-cloud-aiplatform")
        sys.exit(1)

    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        key_path = r"D:\keys\vertex-key.json"
        if os.path.exists(key_path):
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path
        else:
            print("ERROR: GOOGLE_APPLICATION_CREDENTIALS not set and D:\\keys\\vertex-key.json not found.")
            sys.exit(1)

    aspect = RATIO_MAP.get(ratio, "1:1")
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    model = ImageGenerationModel.from_pretrained(MODEL_ID)

    print(f"Generating image with ratio {aspect}...")
    response = model.generate_images(
        prompt=prompt,
        number_of_images=1,
        aspect_ratio=aspect,
    )

    image = response.images[0]
    image.save(output)
    print(f"Saved: {output}")


def main():
    parser = argparse.ArgumentParser(description="Generate image via Vertex AI Imagen 4")
    parser.add_argument("prompt", help="Image generation prompt")
    parser.add_argument("--output", default="./output.png", help="Output file path")
    parser.add_argument("--ratio", default="1:1", choices=list(RATIO_MAP.keys()), help="Aspect ratio")
    args = parser.parse_args()
    generate(args.prompt, args.output, args.ratio)


if __name__ == "__main__":
    main()

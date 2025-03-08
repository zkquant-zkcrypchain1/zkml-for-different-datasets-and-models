import { NextResponse } from "next/server"

// Sample dataset metadata
const DATASETS = {
  mnist: {
    name: "MNIST Handwritten Digits",
    description: "70,000 images of handwritten digits (28x28 pixels)",
    format: "npz",
    size: "11MB",
    features: 784,
    samples: 70000,
    classes: 10,
    sampleData: [
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.9, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    ],
  },
  cifar10: {
    name: "CIFAR-10",
    description: "60,000 color images in 10 classes (32x32 pixels)",
    format: "npz",
    size: "170MB",
    features: 3072,
    samples: 60000,
    classes: 10,
    sampleData: [
      [0.2, 0.5, 0.3, 0.1, 0.7, 0.8, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2],
      [0.3, 0.6, 0.4, 0.2, 0.8, 0.9, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3],
      [0.4, 0.7, 0.5, 0.3, 0.9, 0.1, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3, 0.4],
      [0.5, 0.8, 0.6, 0.4, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3, 0.4, 0.5],
    ],
  },
  iris: {
    name: "Iris Flower Dataset",
    description: "150 samples of iris flowers with 4 features",
    format: "csv",
    size: "4KB",
    features: 4,
    samples: 150,
    classes: 3,
    sampleData: [
      [5.1, 3.5, 1.4, 0.2],
      [4.9, 3.0, 1.4, 0.2],
      [4.7, 3.2, 1.3, 0.2],
      [4.6, 3.1, 1.5, 0.2],
    ],
  },
  boston: {
    name: "Boston Housing",
    description: "506 samples with 13 features for housing price prediction",
    format: "csv",
    size: "37KB",
    features: 13,
    samples: 506,
    classes: "Regression",
    sampleData: [
      [0.00632, 18.0, 2.31, 0, 0.538, 6.575, 65.2, 4.09, 1, 296.0, 15.3, 396.9, 4.98],
      [0.02731, 0.0, 7.07, 0, 0.469, 6.421, 78.9, 4.9671, 2, 242.0, 17.8, 396.9, 9.14],
      [0.02729, 0.0, 7.07, 0, 0.469, 7.185, 61.1, 4.9671, 2, 242.0, 17.8, 392.83, 4.03],
      [0.03237, 0.0, 2.18, 0, 0.458, 6.998, 45.8, 6.0622, 3, 222.0, 18.7, 394.63, 2.94],
    ],
  },
  wine: {
    name: "Wine Quality",
    description: "4,898 wine samples with 11 features",
    format: "csv",
    size: "84KB",
    features: 11,
    samples: 4898,
    classes: "Regression",
    sampleData: [
      [7.4, 0.7, 0.0, 1.9, 0.076, 11.0, 34.0, 0.9978, 3.51, 0.56, 9.4],
      [7.8, 0.88, 0.0, 2.6, 0.098, 25.0, 67.0, 0.9968, 3.2, 0.68, 9.8],
      [7.8, 0.76, 0.04, 2.3, 0.092, 15.0, 54.0, 0.997, 3.26, 0.65, 9.8],
      [11.2, 0.28, 0.56, 1.9, 0.075, 17.0, 60.0, 0.998, 3.16, 0.58, 9.8],
    ],
  },
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const datasetId = url.searchParams.get("id")

  if (datasetId && datasetId in DATASETS) {
    return NextResponse.json({
      success: true,
      dataset: DATASETS[datasetId as keyof typeof DATASETS],
    })
  } else if (!datasetId) {
    // Return list of all datasets
    return NextResponse.json({
      success: true,
      datasets: Object.keys(DATASETS).map((id) => ({
        id,
        ...DATASETS[id as keyof typeof DATASETS],
      })),
    })
  } else {
    return NextResponse.json({ success: false, message: "Dataset not found" }, { status: 404 })
  }
}

export async function POST(request: Request) {
  try {
    // This would handle file uploads in a real implementation
    // For now, we'll just simulate accepting a new dataset

    const body = await request.json()
    const { name, description, format, size, features, samples, classes } = body

    // Validate required fields
    if (!name || !format) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Generate a dataset ID
    const datasetId = name.toLowerCase().replace(/\s+/g, "-")

    return NextResponse.json({
      success: true,
      datasetId,
      message: "Dataset uploaded successfully",
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}


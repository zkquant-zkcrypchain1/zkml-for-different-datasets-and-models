"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Sample datasets that come pre-loaded with the application
const SAMPLE_DATASETS = [
  {
    id: "mnist",
    name: "MNIST Handwritten Digits",
    description: "70,000 images of handwritten digits (28x28 pixels)",
    format: "npz",
    size: "11MB",
    features: 784,
    samples: 70000,
    classes: 10,
  },
  {
    id: "cifar10",
    name: "CIFAR-10",
    description: "60,000 color images in 10 classes (32x32 pixels)",
    format: "npz",
    size: "170MB",
    features: 3072,
    samples: 60000,
    classes: 10,
  },
  {
    id: "iris",
    name: "Iris Flower Dataset",
    description: "150 samples of iris flowers with 4 features",
    format: "csv",
    size: "4KB",
    features: 4,
    samples: 150,
    classes: 3,
  },
  {
    id: "boston",
    name: "Boston Housing",
    description: "506 samples with 13 features for housing price prediction",
    format: "csv",
    size: "37KB",
    features: 13,
    samples: 506,
    classes: "Regression",
  },
  {
    id: "wine",
    name: "Wine Quality",
    description: "4,898 wine samples with 11 features",
    format: "csv",
    size: "84KB",
    features: 11,
    samples: 4898,
    classes: "Regression",
  },
]

export function DataUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [datasets, setDatasets] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Initialize with sample datasets
  useEffect(() => {
    // In a real app, we would check which datasets are available
    setDatasets(SAMPLE_DATASETS.map((dataset) => dataset.id))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setUploadSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setProgress(0)
    setUploadSuccess(false)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      // Simulate API call to upload file
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(interval)
      setProgress(100)

      // Add the dataset to the list if it's not already there
      const datasetId = file.name.split(".")[0].toLowerCase().replace(/\s+/g, "-")
      if (!datasets.includes(datasetId)) {
        setDatasets((prev) => [...prev, datasetId])
      }

      // Select the newly uploaded dataset
      setSelectedDataset(datasetId)
      setUploadSuccess(true)

      // Reset after completion
      setTimeout(() => {
        setUploading(false)
        setFile(null)
      }, 500)
    } catch (err) {
      clearInterval(interval)
      setError("Failed to upload file. Please try again.")
      setUploading(false)
      setProgress(0)
    }
  }

  const handleSelectDataset = (datasetId: string) => {
    setSelectedDataset(datasetId)
    setUploadSuccess(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="dataset">Upload New Dataset</Label>
        <div className="flex gap-2">
          <Input
            id="dataset"
            type="file"
            accept=".csv,.json,.npy,.npz"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button onClick={handleUpload} disabled={!file || uploading}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
        {uploading && (
          <div className="space-y-2 mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">{progress}%</p>
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {uploadSuccess && (
          <Alert variant="default" className="mt-2 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">File uploaded successfully!</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Datasets</h3>
        <p className="text-sm text-muted-foreground">Select a dataset to use for model training and inference.</p>

        <RadioGroup value={selectedDataset || ""} onValueChange={handleSelectDataset} className="space-y-3">
          {SAMPLE_DATASETS.map((dataset) => (
            <Card
              key={dataset.id}
              className={`cursor-pointer transition-colors ${selectedDataset === dataset.id ? "border-primary" : ""}`}
              onClick={() => handleSelectDataset(dataset.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <RadioGroupItem value={dataset.id} id={dataset.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={dataset.id} className="text-base font-medium cursor-pointer">
                    {dataset.name}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{dataset.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span>Format: {dataset.format}</span>
                    <span>Size: {dataset.size}</span>
                    <span>Features: {dataset.features}</span>
                    <span>Samples: {dataset.samples}</span>
                    <span>Classes: {dataset.classes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}


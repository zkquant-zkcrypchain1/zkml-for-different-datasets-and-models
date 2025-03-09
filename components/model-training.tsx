"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Brain, Lock, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ModelTrainingProps {
  onModelTrained: (modelId: string) => void
}

export function ModelTraining({ onModelTrained }: ModelTrainingProps) {
  const [dataset, setDataset] = useState("")
  const [modelType, setModelType] = useState("linear")
  const [epochs, setEpochs] = useState(10)
  const [enablePrivacy, setEnablePrivacy] = useState(true)
  const [training, setTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [modelId, setModelId] = useState<string | null>(null)

  const [datasets, setDatasets] = useState([
    { id: "mnist", name: "MNIST Handwritten Digits" },
    { id: "cifar10", name: "CIFAR-10" },
    { id: "iris", name: "Iris Flower Dataset" },
    { id: "boston", name: "Boston Housing" },
    { id: "wine", name: "Wine Quality" },
  ])

  const handleTrain = async () => {
    if (!dataset) return

    setTraining(true)
    setProgress(0)
    setModelId(null)

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 100)

    try {
      // Simulate API call to train model
      await new Promise((resolve) => setTimeout(resolve, 5000))

      clearInterval(interval)
      setProgress(100)

      // Generate a random model ID
      const newModelId = `model-${Date.now()}`
      setModelId(newModelId)
      onModelTrained(newModelId)

      // Reset after completion
      setTimeout(() => {
        setTraining(false)
      }, 500)
    } catch (err) {
      clearInterval(interval)
      setTraining(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dataset-select">Select Dataset</Label>
          <Select value={dataset} onValueChange={setDataset}>
            <SelectTrigger id="dataset-select">
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((ds) => (
                <SelectItem key={ds.id} value={ds.id}>
                  {ds.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model-type">Model Type</Label>
          <Select value={modelType} onValueChange={setModelType}>
            <SelectTrigger id="model-type">
              <SelectValue placeholder="Select model type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Regression</SelectItem>
              <SelectItem value="logistic">Logistic Regression</SelectItem>
              <SelectItem value="nn">Neural Network</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="epochs">Training Epochs: {epochs}</Label>
          </div>
          <Slider
            id="epochs"
            min={1}
            max={100}
            step={1}
            value={[epochs]}
            onValueChange={(value) => setEpochs(value[0])}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="privacy-mode" checked={enablePrivacy} onCheckedChange={setEnablePrivacy} />
          <Label htmlFor="privacy-mode">Enable Privacy-Preserving Mode</Label>
        </div>
      </div>

      <Button onClick={handleTrain} disabled={!dataset || training} className="w-full">
        <Brain className="mr-2 h-4 w-4" />
        {training ? "Training..." : "Train Model"}
      </Button>

      {training && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-right">{progress}%</p>
        </div>
      )}

      {modelId && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Model trained successfully</p>
                <p className="text-sm text-muted-foreground">Model ID: {modelId}</p>
              </div>
            </div>
            {enablePrivacy && (
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Lock className="mr-1 h-4 w-4" />
                <span>Privacy-preserving mode enabled with GKR protocol</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}


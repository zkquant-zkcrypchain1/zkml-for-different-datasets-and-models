"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lock, FileText, CheckCircle, Database } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ModelInferenceProps {
  modelId: string | null
  onProofGenerated: (proof: any) => void
}

export function ModelInference({ modelId, onProofGenerated }: ModelInferenceProps) {
  const [inputData, setInputData] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [sampleData, setSampleData] = useState<any[]>([])
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [datasets, setDatasets] = useState([
    { id: "mnist", name: "MNIST Handwritten Digits" },
    { id: "cifar10", name: "CIFAR-10" },
    { id: "iris", name: "Iris Flower Dataset" },
    { id: "boston", name: "Boston Housing" },
    { id: "wine", name: "Wine Quality" },
  ])

  // Load sample data when dataset changes
  useEffect(() => {
    if (selectedDataset) {
      // In a real app, we would fetch this from the API
      const fetchSampleData = async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Sample data for each dataset
          const sampleDataMap: Record<string, any[]> = {
            mnist: [
              [0.0, 0.0, 0.0, 0.3, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
              [0.0, 0.0, 0.0, 0.9, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            ],
            cifar10: [
              [0.2, 0.5, 0.3, 0.1, 0.7, 0.8, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2],
              [0.3, 0.6, 0.4, 0.2, 0.8, 0.9, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3],
            ],
            iris: [
              [5.1, 3.5, 1.4, 0.2],
              [4.9, 3.0, 1.4, 0.2],
            ],
            boston: [
              [0.00632, 18.0, 2.31, 0, 0.538, 6.575, 65.2, 4.09, 1, 296.0, 15.3, 396.9, 4.98],
              [0.02731, 0.0, 7.07, 0, 0.469, 6.421, 78.9, 4.9671, 2, 242.0, 17.8, 396.9, 9.14],
            ],
            wine: [
              [7.4, 0.7, 0.0, 1.9, 0.076, 11.0, 34.0, 0.9978, 3.51, 0.56, 9.4],
              [7.8, 0.88, 0.0, 2.6, 0.098, 25.0, 67.0, 0.9968, 3.2, 0.68, 9.8],
            ],
          }

          setSampleData(sampleDataMap[selectedDataset] || [])
        } catch (error) {
          console.error("Error fetching sample data:", error)
        }
      }

      fetchSampleData()
    }
  }, [selectedDataset])

  const handleSelectSample = (index: number) => {
    if (sampleData && sampleData[index]) {
      setInputData(JSON.stringify(sampleData[index], null, 2))
    }
  }

  const handleInference = async () => {
    if (!modelId || !inputData) return

    setLoading(true)
    setResult(null)

    try {
      // Simulate API call for inference
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Parse input data
      const parsedInput = JSON.parse(inputData)

      // Generate mock result with proof
      const mockResult = {
        prediction:
          selectedDataset === "iris"
            ? ["setosa", "versicolor", "virginica"][Math.floor(Math.random() * 3)]
            : selectedDataset === "boston" || selectedDataset === "wine"
              ? (Math.random() * 50).toFixed(2)
              : Math.random() > 0.5
                ? "Class A"
                : "Class B",
        confidence: (Math.random() * 0.5 + 0.5).toFixed(4),
        proof: {
          id: `proof-${Date.now()}`,
          hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          timestamp: new Date().toISOString(),
          verified: true,
        },
      }

      setResult(mockResult)
      onProofGenerated(mockResult.proof)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!modelId) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Please train a model first in the Training tab</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="model-id">Active Model</Label>
          <Badge variant="outline">{modelId}</Badge>
        </div>
        <Input id="model-id" value={modelId} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dataset-select">Select Dataset for Inference</Label>
        <Select value={selectedDataset} onValueChange={setSelectedDataset}>
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

      {selectedDataset && sampleData.length > 0 && (
        <div className="space-y-2">
          <Label>Sample Data Points</Label>
          <div className="flex flex-wrap gap-2">
            {sampleData.map((_, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => handleSelectSample(index)}>
                <Database className="mr-2 h-4 w-4" />
                Sample {index + 1}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="input-data">Input Data</Label>
        <Textarea
          id="input-data"
          placeholder="Enter input data as JSON or comma-separated values"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          rows={4}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Enter data as a JSON array or select a sample above</p>
      </div>

      <Button onClick={handleInference} disabled={!inputData || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Generate Prediction with Proof
          </>
        )}
      </Button>

      {result && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="font-medium">Prediction Result</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Prediction:</span>
                  <span className="ml-2 font-medium">{result.prediction}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="ml-2 font-medium">{result.confidence}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Zero-Knowledge Proof
              </h3>
              <div className="mt-2 text-xs font-mono bg-background p-2 rounded border overflow-x-auto">
                <div>Proof ID: {result.proof.id}</div>
                <div>Hash: {result.proof.hash}</div>
                <div>Timestamp: {result.proof.timestamp}</div>
                <div className="flex items-center mt-1 text-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Proof verified
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


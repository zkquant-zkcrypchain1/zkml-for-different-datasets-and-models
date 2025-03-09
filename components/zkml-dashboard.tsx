"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelTraining } from "./model-training"
import { ModelInference } from "./model-inference"
import { ProofVerification } from "./proof-verification"
import { DataUpload } from "./data-upload"

export function ZKMLDashboard() {
  const [activeModel, setActiveModel] = useState<string | null>(null)
  const [proofData, setProofData] = useState<any>(null)

  return (
    <div className="w-full">
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="inference">Inference</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Upload and manage your datasets for ZKML training</CardDescription>
            </CardHeader>
            <CardContent>
              <DataUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Model Training</CardTitle>
              <CardDescription>Train privacy-preserving machine learning models</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelTraining onModelTrained={(modelId) => setActiveModel(modelId)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inference">
          <Card>
            <CardHeader>
              <CardTitle>Model Inference</CardTitle>
              <CardDescription>Generate predictions with zero-knowledge proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <ModelInference modelId={activeModel} onProofGenerated={(proof) => setProofData(proof)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Proof Verification</CardTitle>
              <CardDescription>Verify zero-knowledge proofs of model predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ProofVerification proofData={proofData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


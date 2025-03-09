"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProofVerificationProps {
  proofData: any
}

export function ProofVerification({ proofData }: ProofVerificationProps) {
  const [proofInput, setProofInput] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    message: string
  } | null>(null)

  // When proofData changes, update the input
  useState(() => {
    if (proofData) {
      setProofInput(JSON.stringify(proofData, null, 2))
    }
  })

  const handleVerify = async () => {
    if (!proofInput) return

    setVerifying(true)
    setVerificationResult(null)

    try {
      // Parse the proof input
      const proof = JSON.parse(proofInput)

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, we'll verify if the proof has the required fields
      const isValid = proof && typeof proof === "object" && proof.id && proof.hash && proof.hash.length === 64

      setVerificationResult({
        verified: isValid,
        message: isValid
          ? "Proof successfully verified. The computation is valid."
          : "Proof verification failed. Invalid or incomplete proof data.",
      })
    } catch (err) {
      setVerificationResult({
        verified: false,
        message: "Invalid proof format. Please check the JSON structure.",
      })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="proof-data">Zero-Knowledge Proof Data</Label>
        <Textarea
          id="proof-data"
          placeholder='{"id": "proof-123", "hash": "..."}'
          value={proofInput}
          onChange={(e) => setProofInput(e.target.value)}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <Button onClick={handleVerify} disabled={!proofInput || verifying} className="w-full">
        {verifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Verify Proof
          </>
        )}
      </Button>

      {verificationResult && (
        <Alert variant={verificationResult.verified ? "default" : "destructive"}>
          <AlertTitle className="flex items-center">
            {verificationResult.verified ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verification Successful
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Verification Failed
              </>
            )}
          </AlertTitle>
          <AlertDescription>{verificationResult.message}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-medium">About GKR Protocol Verification</h3>
          <p className="text-sm text-muted-foreground mt-2">
            The GKR (Goldwasser-Kalai-Rothblum) protocol enables efficient verification of delegated computations. It
            allows a verifier to check the correctness of a computation without re-executing it, using zero-knowledge
            proofs to maintain privacy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


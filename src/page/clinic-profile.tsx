"use client"

import { useEffect, useState } from "react"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { MapPin, Building2, MessageSquare, Copy } from "lucide-react"
import { Card } from "../components/ui/card"
import { ReviewsSection } from "./reviews-section"
import { AppointmentsSection } from "../components/appointments-section"
import { useClinicStore } from "../store/clinic-store"

export function ClinicProfile() {
  const { clinicData, isLoading, error, fetchClinicData } = useClinicStore()
  const [showFullBio, setShowFullBio] = useState(false)

  useEffect(() => {
    fetchClinicData()
  }, [fetchClinicData])

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading clinic information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!clinicData) {
    return null
  }

  const bioText =
    clinicData.bio ||
    "This clinic has been serving the community with dedication for many years, offering a wide range of medical services including primary care..."
  const shouldTruncate = bioText.length > 150
  const displayBio = showFullBio || !shouldTruncate ? bioText : `${bioText.substring(0, 150)}...`

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
          <AvatarImage src={clinicData.avatar || "/placeholder.svg"} alt={clinicData.clinicName} />
          <AvatarFallback className="bg-[#FBAE24] text-2xl text-white sm:text-3xl">
            {clinicData.clinicName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-4 font-bold text-2xl text-foreground sm:text-3xl">{clinicData.clinicName}</h1>

        <p className="mt-1 text-sm text-muted-foreground">@{clinicData.username || "king_faical"}</p>

        <Badge
          className={`mt-3 px-6 py-1 text-sm font-medium rounded-full ${
            clinicData.onlineStatus === "online"
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {clinicData.onlineStatus === "online" ? "Online" : "Offline"}
        </Badge>
      </div>

      <Card className="mb-4 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#FBAE24]/10 p-2 flex-shrink-0">
            <MapPin className="h-5 w-5 text-[#FBAE24]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Address</h3>
            <p className="text-sm text-muted-foreground">
              {clinicData.location.street}, {clinicData.location.cityOrDistrict}, {clinicData.location.stateOrProvince},{" "}
              {clinicData.country}
            </p>
          </div>
        </div>
      </Card>

      {/* Delivery Methods Section */}
      <Card className="mb-4 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#FBAE24]/10 p-2 flex-shrink-0">
            <Building2 className="h-5 w-5 text-[#FBAE24]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-3">Delivery Methods</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                Home Service
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                In-Person
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                Online Session
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Languages Spoken Section */}
      <Card className="mb-4 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#FBAE24]/10 p-2 flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-[#FBAE24]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-3">Languages Spoken</h3>
            <div className="flex flex-wrap gap-2">
              {(clinicData.languages.length > 0 ? clinicData.languages : ["English", "French", "Kinyarwanda"]).map(
                (language, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                    {language}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mb-4 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#FBAE24]/10 p-2 flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-[#FBAE24]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{displayBio}</p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-2 text-sm text-[#FBAE24] hover:text-[#e09d1f] font-medium"
              >
                {showFullBio ? "Read less" : "Read more >"}
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Supported Insurance Section */}
      <div className="mb-12">
        <h2 className="font-bold text-[18px] sm:text-[20px] mb-4 text-center">Supported Insurance</h2>
        <div className="flex justify-center gap-6 sm:gap-8 flex-wrap">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
              <span className="text-xl sm:text-2xl font-bold text-blue-600">RS</span>
            </div>
            <span className="text-sm font-medium">RSSB</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
              <span className="text-base sm:text-xl font-bold text-blue-600">Britam</span>
            </div>
            <span className="text-sm font-medium">Britam</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
              <span className="text-xl sm:text-2xl font-bold text-orange-600">M</span>
            </div>
            <span className="text-sm font-medium">MUA</span>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-bold text-[18px] text-center sm:text-left sm:text-[20px] mb-4">Active Discount Codes</h2>
        <div className="bg-green-50/50 rounded-2xl p-4 space-y-3 border border-green-100">
          <Card className="p-4 bg-white border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">HEALTH20</span>
                  <Badge className="bg-green-500 text-white text-xs hover:bg-green-500">10% off</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Valid until Sep 3</p>
              </div>
              <button
                onClick={() => handleCopyCode("HEALTH20")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </Card>
          <Card className="p-4 bg-white border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground">FAICALI5</span>
                  <Badge className="bg-green-500 text-white text-xs hover:bg-green-500">10% off</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Valid until Aug 30</p>
              </div>
              <button
                onClick={() => handleCopyCode("FAICALI5")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection reviews={clinicData.reviews} />

      {/* Tests/Appointments Section */}
      <AppointmentsSection tests={clinicData.tests} />
    </div>
  )
}

import { create } from "zustand"

interface Location {
  stateOrProvince: string
  cityOrDistrict: string
  street: string
  postalCode: string
  _id: string
}

interface Review {
  reviewNo: number
  rating: number
  comment: string
  patientName: string
}

interface Test {
  testNo: number
  testName: string
  price: number
  currencySymbol: string
  turnaroundTime: string
  preTestRequirements: string
  homeCollection: string
  insuranceCoverage: string
  description: string
  testImage: string
  clinicImage: string
  clinicName: string
}

interface ClinicData {
  clinicId: number
  clinicName: string
  username: string
  bio: string
  avatar: string
  location: Location
  languages: string[]
  deliveryMethods: string[]
  onlineStatus: string
  country: string
  supportInsurance: number[]
  isVerified: boolean
  reviews: Review[]
  tests: Test[]
}

// interface SlotsData {
//   clinicId: number
//   date: string
//   slots: string[]
// }

interface ClinicStore {
  clinicData: ClinicData | null
  isLoading: boolean
  error: string | null
  fetchClinicData: () => Promise<void>
  availableSlots: string[]
  slotsLoading: boolean
  slotsError: string | null
  fetchAvailableSlots: (date: string) => Promise<void>
}

export const useClinicStore = create<ClinicStore>((set) => ({
  clinicData: null,
  isLoading: false,
  error: null,
  availableSlots: [],
  slotsLoading: false,
  slotsError: null,
  fetchClinicData: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://clinic-backend.mylifeline.world/api/v1/clinic/public/med_plus")
      if (!response.ok) {
        throw new Error("Failed to fetch clinic data")
      }
      const result = await response.json()
      if (result.success) {
        set({ clinicData: result.data, isLoading: false })
      } else {
        throw new Error(result.message || "Failed to fetch clinic data")
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },
  fetchAvailableSlots: async (date: string) => {
    set({ slotsLoading: true, slotsError: null })
    try {
      const response = await fetch(
        `https://clinic-backend.mylifeline.world/api/v1/clinic/public/med_plus/slots?date=${date}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch available slots")
      }
      const result = await response.json()
      if (result.success) {
        set({ availableSlots: result.data.slots, slotsLoading: false })
      } else {
        throw new Error(result.message || "Failed to fetch available slots")
      }
    } catch (error) {
      set({ slotsError: (error as Error).message, slotsLoading: false, availableSlots: [] })
    }
  },
}))

"use client"

import { useState } from "react"
import { Shell } from "@/components/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { databaseColumns } from "@/components/database-columns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Database } from "lucide-react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fullDatabaseData = [
  {
    id: "1",
    date: "2024-01-15",
    venue: "Kinnaree",
    city: "Pattaya",
    district: "Soi 6",
    playerScore: 9.4,
    pricePaid: "1500 THB",
    service: "ST",
    tags: ["GFE", "BBFS"],
    author: "Veteran_77",
    source: "ISG Scrape",
  },
  {
    id: "2",
    date: "2024-01-15",
    venue: "Sapphire A Go Go",
    city: "Pattaya",
    district: "Walking Street",
    playerScore: 9.2,
    pricePaid: "2000 THB",
    service: "LT",
    tags: ["GFE"],
    author: "Alpha_23",
    source: "MM Exclusive",
  },
  {
    id: "3",
    date: "2024-01-14",
    venue: "Insomnia (FL)",
    city: "Pattaya",
    district: "LK Metro",
    playerScore: 8.9,
    pricePaid: "1200 THB",
    service: "ST",
    tags: ["Starfish"],
    author: "Hunter_91",
    source: "ISG Scrape",
  },
  {
    id: "4",
    date: "2024-01-14",
    venue: "Dollhouse",
    city: "Pattaya",
    district: "Soi 6",
    playerScore: 7.8,
    pricePaid: "1400 THB",
    service: "ST",
    tags: ["GFE", "BBFS"],
    author: "Nomad_45",
    source: "MM Exclusive",
  },
  {
    id: "5",
    date: "2024-01-13",
    venue: "Windmill",
    city: "Pattaya",
    district: "Walking Street",
    playerScore: 6.2,
    pricePaid: "1800 THB",
    service: "LT",
    tags: ["Starfish"],
    author: "Explorer_12",
    source: "ISG Scrape",
  },
]

export default function IntelDatabase() {
  const [selectedCity, setSelectedCity] = useState("")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [activeTab, setActiveTab] = useState("all")

  const filteredData =
    activeTab === "veteran"
      ? fullDatabaseData.filter((item) => item.author.includes("Veteran") || item.source === "MM Exclusive")
      : fullDatabaseData

  return (
    <Shell>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Intelligence Database</h1>
            <p className="text-muted-foreground">Complete archive of processed reports and intelligence data</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="veteran">Veteran-Verified</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="text-sm font-medium mb-2 block">City</label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger>
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pattaya">Pattaya</SelectItem>
                        <SelectItem value="bangkok">Bangkok</SelectItem>
                        <SelectItem value="medellin">Medellin</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="text-sm font-medium mb-2 block">Date From</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1 w-full">
                    <label className="text-sm font-medium mb-2 block">Date To</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <DataTable columns={databaseColumns} data={filteredData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  )
}

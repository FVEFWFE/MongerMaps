"use client"

import { useState } from "react"
import Link from "next/link"
import { Shell } from "@/components/shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const rankingsData = [
  {
    rank: 1,
    city: "Pattaya",
    country: "Thailand",
    opticsScore: 9.4,
    valueScore: 9.1,
    safetyScore: 8.7,
    slug: "pattaya",
  },
  {
    rank: 2,
    city: "Bangkok",
    country: "Thailand",
    opticsScore: 9.2,
    valueScore: 8.8,
    safetyScore: 8.9,
    slug: "bangkok",
  },
  {
    rank: 3,
    city: "Medellin",
    country: "Colombia",
    opticsScore: 8.9,
    valueScore: 9.3,
    safetyScore: 7.2,
    slug: "medellin",
  },
  {
    rank: 4,
    city: "Prague",
    country: "Czech Republic",
    opticsScore: 8.7,
    valueScore: 8.5,
    safetyScore: 9.1,
    slug: "prague",
  },
  {
    rank: 5,
    city: "Tijuana",
    country: "Mexico",
    opticsScore: 8.5,
    valueScore: 9.0,
    safetyScore: 6.8,
    slug: "tijuana",
  },
  {
    rank: 6,
    city: "Amsterdam",
    country: "Netherlands",
    opticsScore: 8.3,
    valueScore: 7.2,
    safetyScore: 9.4,
    slug: "amsterdam",
  },
  {
    rank: 7,
    city: "Mombasa",
    country: "Kenya",
    opticsScore: 8.1,
    valueScore: 8.9,
    safetyScore: 7.5,
    slug: "mombasa",
  },
  {
    rank: 8,
    city: "Frankfurt",
    country: "Germany",
    opticsScore: 7.9,
    valueScore: 7.1,
    safetyScore: 9.2,
    slug: "frankfurt",
  },
]

export default function GlobalRankings() {
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedData = [...rankingsData].sort((a, b) => {
    if (!sortField) return a.rank - b.rank

    const aValue = a[sortField as keyof typeof a] as number
    const bValue = b[sortField as keyof typeof b] as number

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const getScoreBadge = (score: number) => {
    const color =
      score >= 8.5 ? "text-[hsl(142.1_76.2%_41.2%)]" : score >= 7.5 ? "text-yellow-500" : "text-[hsl(0_72.2%_50.6%)]"
    return (
      <Badge variant="secondary" className={color}>
        {score}
      </Badge>
    )
  }

  return (
    <Shell>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Globe className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Global Mongering Index</h1>
            <p className="text-muted-foreground">Comprehensive rankings of top destinations worldwide</p>
          </div>
        </div>

        {/* Rankings Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("opticsScore")}
                      className="h-auto p-0 font-semibold"
                    >
                      Optics Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("valueScore")}
                      className="h-auto p-0 font-semibold"
                    >
                      Value Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("safetyScore")}
                      className="h-auto p-0 font-semibold"
                    >
                      Safety Score
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((city) => (
                  <TableRow key={city.rank}>
                    <TableCell className="font-medium">#{city.rank}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{city.city}</div>
                        <div className="text-sm text-muted-foreground">{city.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getScoreBadge(city.opticsScore)}</TableCell>
                    <TableCell>{getScoreBadge(city.valueScore)}</TableCell>
                    <TableCell>{getScoreBadge(city.safetyScore)}</TableCell>
                    <TableCell>
                      <Link href={`/map/${city.slug}`}>
                        <Button variant="outline" size="sm">
                          View Map
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}

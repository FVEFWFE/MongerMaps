"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export type DatabaseReport = {
  id: string
  date: string
  venue: string
  city: string
  district: string
  playerScore: number
  pricePaid: string
  service: string
  tags: string[]
  author: string
  source: string
}

export const databaseColumns: ColumnDef<DatabaseReport>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "venue",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Venue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "district",
    header: "District",
  },
  {
    accessorKey: "playerScore",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Player Score™
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const score = Number.parseFloat(row.getValue("playerScore"))
      const variant = score >= 8.5 ? "default" : score >= 7 ? "secondary" : "destructive"
      const color =
        score >= 8.5 ? "text-[hsl(142.1_76.2%_41.2%)]" : score >= 7 ? "text-yellow-500" : "text-[hsl(0_72.2%_50.6%)]"

      return (
        <Badge variant={variant} className={color}>
          {score}
        </Badge>
      )
    },
  },
  {
    accessorKey: "pricePaid",
    header: "Price Paid",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string
      return (
        <Badge variant="secondary" className="text-xs">
          {source}
        </Badge>
      )
    },
  },
]

"use client"
import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useTranslations } from 'next-intl';
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig



export default function HomePage() {
  const t = useTranslations('Dashboard');
  // const t = useTranslations('HomePage');
  const [date, setDate] = React.useState<Date>()
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          <div className="">
          {t('Welcome') + ', Nabil Deraz'}
          </div>
          <div className="">{t('dis')} </div>
        </div>
        <div className="space-x-2">
         <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{t('Pick a date')}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
          {/* <div className="">Lets recap your data for the past period </div> */}
        </div>
        
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        {/* Left Section */}
        <div className="flex space-x-1">
          <Card>
      <CardHeader>
        <CardTitle>{t('Line Chart - Dots')}</CardTitle>
        <CardDescription>{t('date')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {t("Trending")} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {t("Showing total visitors")}
        </div>
      </CardFooter>
    </Card>
        
          
        </div>
        {/* Middle Section */}
        {/* <div className="bg-gray-300 h-32 rounded animate-pulse"></div> */}
        {/* <div className="bg-gray-300 h-32 rounded animate-pulse"></div> */}
        {/* Right Section */}
        {/* <div className="bg-gray-300 h-48 rounded col-span-1 md:col-span-1 animate-pulse"></div> */}
      </div>

      {/* Large Content Section */}
      {/* <div className="bg-gray-300 h-64 rounded mt-4 animate-pulse"></div> */}

      {/* Bottom Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* <div className="bg-gray-300 h-40 rounded animate-pulse"></div>
        <div className="bg-gray-300 h-40 rounded animate-pulse"></div> */}
      </div>
    </div>
  );
}


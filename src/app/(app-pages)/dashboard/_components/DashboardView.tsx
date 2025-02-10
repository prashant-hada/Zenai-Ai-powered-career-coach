'use client'
import { BarChartIcon, Brain, Briefcase,LineChart, TrendingDown, TrendingUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import { Progress } from "@/components/ui/progress";

interface Range{
    role: string; min: number; max: number; median: number; location: string 
}

const DashboardView = ({ insights }) =>
  // :{insights:IndustryInsight}
  {
    const salaryData = insights?.salaryRange.map((range:Range) => ({
      name: range.role,
      min: range.min / 1000,
      max: range.max / 1000,
      median: range.median / 1000,
    }));

    const getDemandLevelColor = (level: string) => {
      switch (level.toLowerCase()) {
        case "high":
          return "bg-green-500";
        case "medium":
          return "bg-yellow-500";
        case "low":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };

    const getMarketOutlookInfo = ((outlook:string) => {
      switch (outlook.toLowerCase()) {
        case "positive":
          return <TrendingUp className="h-4 w-4 text-green-500" />
        case "neutral":
          return <LineChart className="h-4 w-4 text-yellow-500" />
        case "negative":
          return <TrendingDown className="h-4 w-4 text-red-500" />
        case "default":
          return <LineChart className="h-4 w-4 text-gray-500" />
      }
    })

    const demandLevelColor = getDemandLevelColor(insights.demandLevel);
    // const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook)?.icon;
    // const outlookColor = getMarketOutlookInfo(insights.marketOutlook)?.color;

    const lastUpdateDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateRemainingTime = formatDistanceToNow(
      new Date(insights.nextUpdate),
      { addSuffix: true }
    );
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Badge variant={"secondary"}>Last updated: {lastUpdateDate}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Market Outlook card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Market Outlook
              </CardTitle>
              {
                getMarketOutlookInfo(insights?.marketOutlook || 'neutral')
              }
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.marketOutlook}</div>
              <p className="text-xs text-muted-foreground">
                Next update {nextUpdateRemainingTime}
              </p>
            </CardContent>
          </Card>
            {/* Industr growth card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Industry Growth
              </CardTitle>
              <BarChartIcon className={`h-4 w-4 text-muted-foreground `} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.growthRate.toFixed(1)}%</div>
              <Progress value ={insights.growthRate} className="mt-2" />
            </CardContent>
          </Card>

        {/* Demand Level Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Demand Level
              </CardTitle>
              <Briefcase className={`h-4 w-4 text-muted-foreground`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.demandLevel}</div>
              <div className={`h-2 w-full rounded-full mt-2 ${demandLevelColor}`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Skills
              </CardTitle>
              <Brain className={`h-4 w-4 text-purple-600`} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {insights.topSkills.map((skill:string)=>(
                    <Badge key={skill} variant={'secondary'} >
                        {skill}
                    </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bar-graph">
        <Card>
            <CardHeader className="flex flex-col items-start justify-start space-y-2 pb-2">
              <CardTitle className="font-medium">
              Salary Ranges By Roles
              </CardTitle>
              <CardDescription>
                Displaying minimum, median and maximum salaries (in thousands)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salaryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-md">
                      <p className="font-medium">{label}</p>
                      {payload.map((item) => (
                        <p key={item.name} className="text-sm">
                          {item.name}: ${item.value}K
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
          />
          <Bar dataKey="min" fill="#94a3b8" name= 'Min Salary'  />
          <Bar dataKey="median" fill="#64748b" name= 'Median Salary'  />
          <Bar dataKey="max" fill="#475569" name= 'Max Salary'  />
        </BarChart>
      </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
            <CardHeader className="">
              <CardTitle className="text-sm font-medium">
                Key Industry Trends
              </CardTitle>
              <CardDescription>
                Current trends shaping the Industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {insights.keyTrends.map((trend,index)=>(
                    <li key={index} className="flex items-start space-x-2">
                        <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                        <span>{trend}</span>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="">
              <CardTitle className="text-sm font-medium">
                Recommended Skills
              </CardTitle>
              <CardDescription>
                Skills that in-demand right now.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=" flex flex-wrap gap-2">
                {insights.recommendedSkills.map((skill:string)=>(
                    <Badge key={skill}><span className="text-purple-600">{skill}</span></Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    );
  };

export default DashboardView;

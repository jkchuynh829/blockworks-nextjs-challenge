import Head from "next/head";
import Layout from "../components/layout";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import FilterButtons from "../components/filterButton";

interface Data {
  time: string;
  [key: string]: string;
}

interface HomeProps {
  data: Data[];
}

const Home: React.FC<HomeProps> = ({ data }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const interval = useMemo(() => {
    switch (selectedFilter) {
      case "12M":
        return 30;
      case "3M":
        return 15;
      case "1M":
        return 7;
      case "YTD":
        return undefined;
      default:
        return 365;
    }
  }, [selectedFilter]);

  const latestDate = useMemo(() => {
    if (!data) {
      return new Date();
    }
    const sortedData = [...data].sort((a, b) => a.time.localeCompare(b.time));
    return new Date(sortedData[sortedData.length - 1].time);
  }, [data]);

  const filteredData = data.filter((dataPoint: any) => {
    const date = new Date(dataPoint.time);
    const now = latestDate;

    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    switch (selectedFilter) {
      case "YTD":
        return date.getFullYear() === now.getFullYear();
      case "12M":
        return now.valueOf() - date.valueOf() <= 12 * oneMonth;
      case "3M":
        return now.valueOf() - date.valueOf() <= 3 * oneMonth;
      case "1M":
        return now.valueOf() - date.valueOf() <= oneMonth;
      default:
        return true;
    }
  });

  const formatYAxis = useCallback((num: number) => {
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(1);
  }, []);

  const formatXAxis = useCallback(
    (time: string) => {
      const date = new Date(time);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString();

      switch (selectedFilter) {
        case "12M":
          return `${month}/${year}`;
        case "3M":
          return `${month}/${day}/${year}`;
        case "1M":
          return `${month}/${day}/${year}`;
        case "YTD":
          return `${month}/${day}/${year}`;
        default:
          return year;
      }
    },
    [selectedFilter]
  );

  const formatTooltipValues = useCallback((value: number) => {
    if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(2) + "m";
    if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(2) + "k";
    return value.toFixed(2);
  }, []);

  const formatTooltipLabel = useCallback((label: string) => {
    const date = new Date(label);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const activeDotStyle = {
    r: 8,
    fill: "#1F77B4",
    stroke: "#fff",
    strokeWidth: 2,
  };

  return (
    <Layout home>
      <Head>
        <title>BTC Address Balances over Time</title>
      </Head>
      <section>
        <div className="max-w-4xl mx-auto p-8 text-center h-96">
          <ResponsiveContainer>
            <LineChart width={400} height={400} data={filteredData ?? []}>
              <XAxis
                dataKey="time"
                tickFormatter={formatXAxis as any}
                interval={interval}
              />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip
                formatter={formatTooltipValues as any}
                labelFormatter={formatTooltipLabel}
              />
              <Legend />
              <Line
                dataKey=">$1k"
                dot={false}
                stroke="#1F77B4"
                activeDot={activeDotStyle}
              />
              <Line
                dataKey=">$10k"
                dot={false}
                stroke="#FF7F0E"
                activeDot={activeDotStyle}
              />
              <Line
                dataKey=">$100k"
                dot={false}
                stroke="#2CA02C"
                activeDot={activeDotStyle}
              />
              <Line
                dataKey=">$1m"
                dot={false}
                stroke="#D62728"
                activeDot={activeDotStyle}
              />
              <Line
                dataKey=">$10m"
                dot={false}
                stroke="#9467BD"
                activeDot={activeDotStyle}
              />
            </LineChart>
          </ResponsiveContainer>
          <FilterButtons
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const router = useRouter();
  const basePath = router.basePath;

  const fetchData = async (): Promise<Data[]> => {
    const response = await fetch(`${basePath}/btc-addresses`);
    return await response.json();
  };

  const data = await fetchData();

  return {
    props: {
      data,
    },
  };
};

export default Home;

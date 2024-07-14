'use client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
} from 'chart.js'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
)

const Areachart = ({ values, labels }: { values: any[]; labels: string[] }) => {
  const data = {
    labels: labels ?? [],
    datasets: [
      {
        label: '',
        data: values ?? [],
        fill: true, // This option is what creates the area effect
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: { display: false },
        beginAtZero: true,
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default Areachart

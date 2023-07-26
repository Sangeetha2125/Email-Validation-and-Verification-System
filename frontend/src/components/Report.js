import axios from "axios"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"

function Report(){

  const [reportDetails,setReportDetails] = useState(null)

  useEffect(()=>{
    const userId = JSON.parse(localStorage.getItem('current_user')).id
    axios.get(`lists/report/${userId}`)
    .then(res => {
      setReportDetails(res.data.data)
    })
    .catch(err => {
      console.log(err)
    })
  },[])
  
  const data = {
      labels: reportDetails && reportDetails.map(report => report.name),
      datasets: [
        {
          label: 'Valid Count',
          data: reportDetails && reportDetails.map(report => report.valid_count),
        },
        {
          label: 'Invalid Count',
          data: reportDetails && reportDetails.map(report => report.invalid_count),
        },
        {
          label: 'Domain Count',
          data: reportDetails && reportDetails.map(report => report.domain_count),
        },
        {
          label: 'Role Count',
          data: reportDetails && reportDetails.map(report => report.role_count),
        },
        {
          label: 'Spam Count',
          data: reportDetails && reportDetails.map(report => report.spam_count),
        },
      ],
    }

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Path Count',
          },
        },
        x: {
          title: {
            display: true,
            text: 'List Names',
          },
        },
      },
    }
  
    return reportDetails && <Line data={data} options={options} />
}

export default Report
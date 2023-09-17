import { useState } from 'react'

function BuyCredits(){
    const [currentUser] = useState(JSON.parse(localStorage.getItem('current_user')))
        return (
        <>
            {/* <stripe-pricing-table pricing-table-id="prctbl_1NQ6DWSBw9ZI2CxWQs90YfFO"
            publishable-key="pk_test_51MycymSBw9ZI2CxWN7pYN76HgizMV1VkPIETU3jBCuwNmX2lwfdnZILu3kaPFhLBWEVA82LT5TbuZojz0y7g090900Fm8Bkcr7"
            customer-email= {currentUser.email}

            ></stripe-pricing-table> */}

            <stripe-pricing-table pricing-table-id="prctbl_1NrJbdSFOb1KvBTJyoiTRVkw"
            publishable-key="pk_test_51NrJQvSFOb1KvBTJpyOVRvWBW1RxFxDytfwVLjnUvhfVdmCFhkHzM4yCkHeMEeA3OJzU3WeXsMPUWdzJPIkp6L9X00ElUfoeVo" customer-email= {currentUser.email}>
            </stripe-pricing-table>
        </>
    )
}

export default BuyCredits
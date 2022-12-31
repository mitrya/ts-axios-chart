import { Crypto } from "../../types/Types";

export type AppProps = {
    crypto : Crypto;
}

function CryptoSummary({crypto}:AppProps)
{
    return(
        <>
             <div>{crypto.name + '  INR ' + crypto.current_price}</div>

        </>
    )
}

export default CryptoSummary; 
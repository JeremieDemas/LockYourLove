import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { signIn } from 'next-auth/react';
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, ChakraProvider, Flex, Text } from '@chakra-ui/react'

function SignIn() {
    const { connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { push } = useRouter();

    const handleAuth = async () => {
        
        console.log("handleAuth...")
        if (isConnected) {
            await disconnectAsync();
        }

        const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });
        console.log(account, chain)
        
        const userData = { address: account, chain: chain.id, network: 'evm' };
        console.log(userData)

        const { data } = await axios.post('/api/auth/request-message', userData, {
            headers: {
                'content-type': 'application/json',
            },
        });
        console.log(data.message)

        const message = data.message;

        const signature = await signMessageAsync({ message });

        // redirect user after success authentication to '/user' page
        const { url } = await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/user' });
        /**
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
        push(url);
    };

    return (
        <div>
            <Flex direction="column" justifyContent="center"  alignItems="center" width="100vw" height="100vh" bgGradient="linear(to-br, teal.400, red.300)">
            <Text fontSize="5xl" fontWeight="bold" color="white">Lock Your Love</Text>
            <Button colorScheme="red" size="lg" mt="6"
                onClick={ () => handleAuth({}) }
            >Login with Metamask</Button>
            </Flex>
        </div>

       
        
    );
}

export default SignIn;
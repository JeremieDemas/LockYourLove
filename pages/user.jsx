import { getSession, signOut } from 'next-auth/react';
import { Grid, GridItem } from '@chakra-ui/react'
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import React, { useRef, useState, useEffect } from 'react'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
      () => {
        const controls = new OrbitControls(camera, gl.domElement);
  
        controls.minDistance = 1;
        controls.maxDistance = 12;
        return () => {
          controls.dispose();
        };
      },
      [camera, gl]
    );
    return null;
  };
  
 
 
function Terra() {
    const [terraMap, bumpMap] = useLoader(TextureLoader, ['./earthmap2k.jpg','./earthbump.jpg'])
    return (
      <mesh>
        {/* Width and height segments for displacementMap */}
        <sphereGeometry args={[1, 512, 512]} />
        <meshPhongMaterial
          map={terraMap}
          bumpmap={bumpMap}
          roughness={1}
          metalness={0}
          bumpScale={0.3}
          wireframe={false}
        />
      </mesh>
    )
  }

  function Heart() {
    
    //miami
    let pointHeart = {
      lat: 25.7617,
      lng: -80.1918
    }

    let posHeart = calcPosFromLatLonRad(pointHeart.lat,pointHeart.lng)

    return (
      <mesh
          position={[posHeart.x,posHeart.y,posHeart.z]}
      >
        <sphereGeometry args={[0.01, 20, 20]} />
        <meshBasicMaterial color={"red"} />
        
      </mesh>
    )
  }

function calcPosFromLatLonRad(lat, lon){

    var phi = (90-lat)*(Math.PI/180)
    var theta = (lon-180)*(Math.PI/180)

    let x = -(Math.sin(phi) * Math.cos(theta))
    let z = Math.sin(phi) * Math.sin(theta)
    let y = Math.cos(phi)

    return{x,y,z}
}
  
function User({ user }) {
    return (

        <div >
            <Grid templateAreas={`"header header"
                            "nav main"
                            "nav footer"`}
                        gridTemplateRows={'50px 1fr 30px'}
                        gridTemplateColumns={'150px 1fr'}
                        h='100vh'
                        gap='1'
                        color='blackAlpha.700'
                        fontWeight='bold'>

                <GridItem pl='2' bg='red.300' area={'header'}>

                    <h4>User session:</h4>
                    <pre>{JSON.stringify(user.address, null, 2)}</pre>
                </GridItem>

                <GridItem pl='2' bg='blue.300' area={'nav'}>
                <button onClick={() => signOut({ redirect: '/signin' })}>Sign out</button>
                </GridItem>

                <GridItem pl='2' bg='black' area={'main'}>
                <Canvas>
                    <CameraController />
                    <ambientLight color={"white"} intensity={0.2}/>         
                    <pointLight position={[5, 3, 5]} intensity={0.9} color="#fff" />             
                    <Terra position={[0, 0, 0]} />
                    <Heart position={[-1.2, 0, 0]}></Heart>
                </Canvas>
                </GridItem>
                
                <GridItem pl='2' bg='blue.700' area={'footer'}>
                    Footer 
                </GridItem>

            </Grid>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { user: session.user },
    };
}

export default User;
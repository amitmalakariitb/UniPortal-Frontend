<template>
    <div class="cont">
        <div class="Header">{{ headerName }}</div>
    </div> 
    

 </template>
 
 <script>
 export default {
     name: 'Header',
     props: ['headerName']
    //  props: {
    //     headerName: string, 
    //  },
 }
 
 </script>
 
 <style scoped>

 
 .Header{
background: #D9D9D9;
color: #000000;
font-family: 'Zilla Slab', serif;
font-size: 80px;
display: flex;
flex-grow: 1;
justify-content: center;
align-items: center;
margin-left: 35%;
margin-top: 18vh;
height: 40vh;
width: 55%;
margin-right: 10%;
border-radius: 29px;
padding: 25px 48px 25px 48px;
font-weight:400;
position: absolute;
}

 </style>
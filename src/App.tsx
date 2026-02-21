// import { useState } from 'react'
import './App.css'
// import Luffy from './components/LuffyCharacter'
// import ZorroCharacter from './components/ZorroCharacter'

// Array of No images
// const noImages = [
//   '/No1.gif',
//   '/No2.gif',
//   '/No3.gif',
//   '/No4.gif',
//   '/No5.gif',

// ];

// // Array of Yes images
// const yesImages = [
//   '/yes1.gif',
//   '/Yes2.gif',
//   // '/Yes3.gif',

// ];

// Simple Datepicker component
// const Datepicker = ({ onChange }: { onChange: (date: string) => void }) => {
//   return <input type="date" onChange={(e) => onChange(e.target.value)} />
// }

function App() {
  // const [selectedDate, setSelectedDate] = useState('')
  // const [noClickCount, setNoClickCount] = useState(0)
  // const [yesClickCount, setYesClickCount] = useState(0)
  // const [getCurrentImage, setCurrentImage] = useState('/default.gif')
  // const [selectedCharacter, setSelectedCharacter] = useState<'luffy' | 'zorro'>('luffy')

  // const toggleYesLock = () => {
  //   setYesLock(!yesLock);
  // }

  // Check if the selected date is Valentine's Day (February 14th)
  // const isValentinesDay = () => {
  //   if (!selectedDate) return false
  //   const date = new Date(selectedDate)
  //   return date.getMonth() === 1 && date.getDate() === 14 // Month is 0-indexed, so 1 = February
  // }

  // const resetNoCounts = () => {
  //   setNoClickCount(0)
  // }
  // const resetYesCounts = () => {
  //   setYesClickCount(0)
  // }

  // const yesHandler = () => {
  //   console.log("current image", getCurrentImage)
  //   if (yesClickCount >= yesImages.length -1) {
  //     resetYesCounts()
  //   }
  //   else {
  //     setYesClickCount(prev => prev + 1)
  //   }
  //   const index = Math.min(yesClickCount, yesImages.length - 1)
  //   setCurrentImage(yesImages[index])
  //   // alert("Yay! Happy Valentine's Day! ❤️")
  // }

  // const noHandler = () => {
  //   if (noClickCount >= noImages.length - 1) {
  //     resetNoCounts()
  //   }
  //   else {
  //     setNoClickCount(prev => prev + 1)
  //   }
  //   const index = Math.min(noClickCount, noImages.length - 1)
  //   setCurrentImage(noImages[index])
  // }

  // Get current image based on click counts
  // const getCurrentImage = () => {
  //   if (yesClickCount > 0) {
  //     const index = Math.min(yesClickCount - 1, yesImages.length - 1)
  //     console.log("yes click count:", yesClickCount, "no click count:", noClickCount, "index:", index, "image:", yesImages[index])
  //     return yesImages[index]
  //   } else {
  //     const index = Math.min(noClickCount, noImages.length - 1)
  //       console.log("inside no ","yes click count:", yesClickCount, "no click count:", noClickCount, "index:", index, "image:", noImages[index])
  //     return noImages[index]
  //   }
  // }

  return (
    <div className='container'>
      <img src="/meh.png" alt="sad" />
      {/* {!isValentinesDay() && <Datepicker onChange={setSelectedDate} />}

      {isValentinesDay() && (
        <>
          <div className='text-container'>
            Will you be my valentine?
          </div>

          <div className='image-container'>
            <img className = 'img' src={getCurrentImage} alt="reaction" />
          </div>

          <div className='button-container'>
            <button onClick={yesHandler}>
              Yes
            </button>
            <button onClick={noHandler}>
              No
            </button>
          </div>

          

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => setSelectedCharacter('luffy')}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: selectedCharacter === 'luffy' ? '#ff6b6b' : '#ddd',
                color: selectedCharacter === 'luffy' ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: selectedCharacter === 'luffy' ? 'bold' : 'normal'
              }}
            >
              🏴‍☠️ Luffy
            </button>
      
          </div>
          
        </>
      )}
      
      {isValentinesDay() && (
        <>
          <div style={{ display: selectedCharacter === 'luffy' ? 'block' : 'none' }}>
            <Luffy key="luffy-game" />
          </div>
          <div style={{ display: selectedCharacter === 'zorro' ? 'block' : 'none' }}>
            <ZorroCharacter key="zorro-game" />
          </div>
        </>
      )} */}
    </div>
  )
}

export default App

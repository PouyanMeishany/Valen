import './App.css'
import { ImageSequencePlayer } from './components/ImageSequencePlayer'

// Example: Add your image arrays here
const exampleImages = [
  '/monkByTheSea.jpg'
]

function App() {
  return (
    <div className='app-container'>
    
      <div className='player-container'>
        <ImageSequencePlayer 
          images={exampleImages}
          speed={200}
          loop={true}
          autoPlay={true}
        />
      </div>
    </div>
  )
}

export default App

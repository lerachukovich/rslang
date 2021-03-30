import React from 'react'
import {Link} from 'react-router-dom'

const GamePage = () => {
  return(
    <div>
      <h1>This is Game page</h1>
      <Link to={'games/savanna'}>Savanna</Link>
    </div>
  )
}

export default GamePage;

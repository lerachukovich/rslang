import React from 'react'
import {Link} from 'react-router-dom';

const SavannaPromo = () => {
  return(
    <div>
      <h1>This is Savanna promo page</h1>
      <Link to={'/games/savanna/play'} className={"waves-effect waves-light btn"}>Играть</Link>
    </div>
  )
}

export default SavannaPromo;

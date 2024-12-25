import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import URL from 'utils/url';

export default function Main(){
    const navigate = useNavigate();

    return(<div>Welcome Shift!</div>);
}
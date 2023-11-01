import { AppBar, Toolbar, Typography, TextField, Button, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import Login from './components/Login/Login';
import State from './store/State';
import { useState, useEffect } from 'react'
import instance from './axiosInstance';

const App = observer(() => {
  const [login, setLogin] = useState<boolean>(false)
  const token = State.getUser().token


  useEffect(() => {
    const check = async () => {
      const data = await instance.post('/admin/check')
      console.log(data.data)
      if (data.data.error === false) {
        setLogin(true)
      } else {
        setLogin(false)
      }
    }

    check()
  }, [token])


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Админка</Typography>
        </Toolbar>
      </AppBar>
      {login ? <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <TextField
          label="Текст уведомления"
          variant="outlined"
          multiline
          rows={6}
          maxRows={6}
        />
        <Button variant="contained" color="primary" sx={{ marginTop: '10px' }}>Отправить</Button>
      </Box> : <Login />}

    </div>
  )
})

export default App

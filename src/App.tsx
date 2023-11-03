import { AppBar, Toolbar, Typography, TextField, Button, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import Login from './components/Login/Login';
import State from './store/State';
import { useState, useEffect } from 'react'
import instance from './axiosInstance';

const App = observer(() => {
  const [login, setLogin] = useState<boolean>(false)
  const token = State.getUser().token
  const [notificationText, setNotificationText] = useState<string>("");


  useEffect(() => {
    const check = async () => {
      const data = await instance.post('/admin/check')
      if (data.data.error === false) {
        setLogin(true)
      } else {
        setLogin(false)
      }
    }

    check()
  }, [token])

  const handleSendNotification = async () => {
    try {
      const response = await instance.post('/admin/notification', {
        text: notificationText
      });
      console.log('Notification sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };


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
          onChange={(e) => setNotificationText(e.target.value)}
        />
        <Button variant="contained" color="primary" sx={{ marginTop: '10px' }} onClick={handleSendNotification}>Отправить</Button>
      </Box> : <Login />}

    </div>
  )
})

export default App

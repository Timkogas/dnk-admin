import { AppBar, Toolbar, Typography, TextField, Button, Box, Switch, FormControlLabel, Select, MenuItem, InputLabel } from '@mui/material';
import { observer } from 'mobx-react-lite';
import Login from './components/Login/Login';
import State from './store/State';
import { useState, useEffect } from 'react'
import instance from './axiosInstance';

enum Profile {
  Profile1 = 'Девушки 18-25 лет',
  Profile2 = 'Девушки 26-33 лет',
  Profile3 = 'Женщины 34-43 лет',
  Profile4 = 'Женщины 44-56 лет',
  Profile5 = 'Мужчины 18-25 лет',
  Profile6 = 'Мужчины 26-35 лет',
  Profile7 = 'Мужчины 36-45 лет',
  Profile8 = 'Мужчины 46-54 лет'
}

const App = observer(() => {
  const [login, setLogin] = useState<boolean>(false)
  const token = State.getUser().token
  const [notificationText, setNotificationText] = useState<string>("");
  const [counters, setCounters] = useState({
    allStartCount: 0,
    uniqueStartCount: 0,
    getResultCount: 0
  });

  const [viewByArchetypes, setViewByArchetypes] = useState(true);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [selectedArchetypes, setSelectedArchetypes] = useState([]);
  const [allArchetypes, setAllArchetypes] = useState<{ _id: string, name: string }[]>([]);

  useEffect(() => {
    const check = async () => {
      const data = await instance.post('/admin/check')
      if (data?.data?.error === false) {
        setLogin(true)
        if (data?.data?.data) {
          setCounters({
            allStartCount: data?.data?.data.allStartCount,
            uniqueStartCount: data?.data?.data.uniqueStartCount,
            getResultCount: data?.data?.data.getResultCount,
          });
          setAllArchetypes(data?.data?.data.archetypes)
        }
      } else {
        setLogin(false)
      }
    }

    check()
  }, [token])

  const handleSendNotification = async () => {
    try {
      const targets = viewByArchetypes ? selectedArchetypes : selectedProfiles;
      const targetType = viewByArchetypes ? 'archetypes' : 'profiles';
      const response = await instance.post('/admin/notification', {
        text: notificationText,
        targets: targets,
        targetType: targetType,
      });
      console.log('Notification sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleArchetypesChange = (event: any) => {
    setSelectedArchetypes(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProfilesChange = (event: any) => {
    setSelectedProfiles(event.target.value);
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
          sx={{ width: '300px' }}
          variant="outlined"
          multiline
          rows={6}
          maxRows={6}
          onChange={(e) => setNotificationText(e.target.value)}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '20px' }}>
          <Typography>По профайлам</Typography>
          <FormControlLabel
            label=''
            sx={{ marginRight: '-10px' }}
            control={<Switch checked={viewByArchetypes} onChange={() => setViewByArchetypes(!viewByArchetypes)} />}
          />
          <Typography>По архетипам</Typography>
        </Box>

        {viewByArchetypes && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '10px' }}>

            <InputLabel id="archetypes-label" sx={{ marginBottom: '10px' }}>Архетипы</InputLabel>
            <Select
              sx={{ width: '300px' }}
              multiple
              labelId="archetypes-label"
              id="archetypes-select"
              value={selectedArchetypes}
              onChange={handleArchetypesChange}
            >
              {allArchetypes.map((archetype) => (
                <MenuItem key={archetype._id} value={archetype._id}>
                  {archetype.name}
                </MenuItem>
              ))}
            </Select>

            <Typography sx={{ marginTop: '20px', fontWeight: 800 }}>Выбранные архетипы:</Typography>
            {selectedArchetypes.map((archetypeId) => {
              const selectedArchetype = allArchetypes.find((archetype) => archetype._id === archetypeId);
              if (selectedArchetype) {
                return (
                  <Typography key={selectedArchetype._id}>
                    {selectedArchetype.name}
                  </Typography>
                );
              }
            })}
          </Box>
        )}

        {!viewByArchetypes && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '10px' }}>
            <InputLabel id="profiles-label">Выберите профили</InputLabel>
            <Select
              sx={{ width: '300px' }}
              multiple
              labelId="profiles-label"
              id="profiles-select"
              value={selectedProfiles}
              onChange={handleProfilesChange}
            >
              {Object.values(Profile).map((profile) => (
                <MenuItem key={profile} value={profile}>
                  {profile}
                </MenuItem>
              ))}
            </Select>

            <Typography sx={{ marginTop: '20px', fontWeight: 800 }}>Выбранные параметры:</Typography>
            {selectedProfiles.map((profile) => (
              <Typography key={profile}>
                {profile}
              </Typography>
            ))}
          </Box>
        )}
        <Button variant="contained" color="primary" sx={{ marginTop: '10px' }} onClick={handleSendNotification}>Отправить</Button>
        <Box sx={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 800 }}>Статистика</Typography>
          <Typography sx={{ fontWeight: 600 }}>Общее количество запусков сервиса: {counters.allStartCount + counters.uniqueStartCount}</Typography>
          <Typography sx={{ fontWeight: 600 }}>Количество уникальных запусков сервиса: {counters.uniqueStartCount}</Typography>
          <Typography sx={{ fontWeight: 600 }}>Количество завершенных игровых сессий: {counters.getResultCount}</Typography>
        </Box>
      </Box> : <Login />}

    </div>
  )
})

export default App

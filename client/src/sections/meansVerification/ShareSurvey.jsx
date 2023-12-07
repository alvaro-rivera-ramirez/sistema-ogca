import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Button
} from "@mui/material";
import {Person as PersonIcon,Send as SendIcon} from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useAuth } from "../../context/AuthProvider";
import { getListUserWithOutAccess } from "../../utils/fetchUser";
import { createAccessSurvey, getUsersAccessToSurvey } from "../../utils/fetchSurvey";

const ShareSurvey = ({ code }) => {
  const [listUserAccess, setListUserAccess] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listUserSelected, setListUserSelected] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const { accessToken } = useAuth();

  async function fetchUser() {
    try {
      const { users } = await getListUserWithOutAccess(
        accessToken,
        1,
        10,
        searchUser,
        code
      );
      setListUser(users);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchListUserAccess(code) {
    try {
      const data = await getUsersAccessToSurvey(code, accessToken);
      setListUserAccess(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = (valueToDelete) => {
    setListUserSelected((prevValuesUsers) =>
      prevValuesUsers.filter((value) => value.userId !== valueToDelete.userId)
    );
  };

  async function onSubmitShareSurvey(){
    try {
      await createAccessSurvey(code,listUserSelected,accessToken);
      
      setSearchUser("")
      setListUserSelected([])
      fetchListUserAccess(code);
    } catch (error) {
      console.log(error)
     
    }
  }
  useEffect(() => {
    fetchUser();
  }, [searchUser]);

  useEffect(() => {
    fetchListUserAccess(code);
  }, []);

  const handleAutocompleteChange = (event, values) => {
    console.log(event)
    setListUserSelected(values);
  };

  return (
    <>
      <Autocomplete
        multiple
        limitTags={3}
        sx={{ width: "500px", paddingTop: 1 }}
        getOptionLabel={(user) => `${user.nameUser} ${user.lastnameUser}`}
        options={listUser.length>0?listUser:[]}
        inputValue={searchUser}
        onInputChange={(event, newInputValue) => {
          setSearchUser(newInputValue);
        }}
        value={listUserSelected}
        onChange={handleAutocompleteChange}
        noOptionsText={"No se ha encontrado usuarios"}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Buscar usuario" />
        )}
        
        isOptionEqualToValue={(option, value) => option.userId === value.userId}
        renderOption={(props, usersResult) => (
          <Box
            component="li"
            {...props}
            key={usersResult.userId}
            value={usersResult.userId}
          >
            {usersResult.nameUser} {usersResult.lastnameUser}
          </Box>
        )}
      />
      {listUserAccess.length > 0 && (
        <List sx={{ pt: 0 }}>
          {listUserAccess.map(({ user }) => (
            <UserAccess key={user.userId} email={user.emailUser} />
          ))}
        </List>
      )}
      <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            sx={{paddingTop:"8px"}}
          >
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={onSubmitShareSurvey}
              style={{ backgroundColor: "#1565C0", color: "white" }}
            >
              Guardar
            </Button>
          </Stack>
    </>
  );
};

const UserAccess = ({ email }) => {
  return (
    <ListItem disableGutters key={email}>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={email} />
      </ListItemButton>
    </ListItem>
  );
};
export default ShareSurvey;

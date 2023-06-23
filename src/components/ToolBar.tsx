import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { PlusIcon, SearchIcon } from 'lucide-react'

interface IToolBarOptions {
  searchText?: string
  onChangeSearchText?: (newText: string) => void
  onClickButtonNew?: () => void
}

const ToolBar = ({
  onChangeSearchText,
  searchText = '',
  onClickButtonNew,
}: IToolBarOptions) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      paddingY={1}
      paddingX={2}
      component={Paper}
      elevation={2}
    >
      <Box width={smDown ? '100%' : mdDown ? '70%' : theme.spacing(40)}>
        <TextField
          value={searchText}
          onChange={(e) => onChangeSearchText?.(e.target.value)}
          size="small"
          label="Search"
          variant="standard"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={16} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box flex={1} display="flex" justifyContent="flex-end">
        <Button
          onClick={onClickButtonNew}
          variant="contained"
          size="small"
          disableElevation
          endIcon={<PlusIcon size={16} />}
        >
          Adicionar
        </Button>
      </Box>
    </Stack>
  )
}

export default ToolBar

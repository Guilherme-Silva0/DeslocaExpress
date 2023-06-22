'use client'

import Header from '@/components/Header'
import TypingEffect from '@/components/TypingEffect'
import {
  Box,
  Grid,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material'

export default function Home() {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const sxDown = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Box height="100%" sx={{ overflowX: 'hidden' }}>
      <Header title="" />
      <Grid container spacing={4} width="auto" padding={sxDown ? 1 : 3}>
        <Grid item xs={12}>
          <Typography
            variant={smDown ? 'h4' : mdDown ? 'h3' : 'h2'}
            component="h1"
            align="center"
            mb={2}
          >
            <TypingEffect words={['Bem-vindo à Tela de Administração!']} />
          </Typography>
          <Typography
            variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
            component="h2"
            align="center"
            mb={4}
          >
            Gerencie sua distribuidora de forma eficiente e organizada.
          </Typography>
          <Typography variant="body1" align="center" mb={4}>
            Tenha controle total sobre clientes, condutores, deslocamentos,
            veículos e muito mais.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component={Paper}
            bgcolor="primary.main"
            color="primary.contrastText"
            elevation={5}
            py={sxDown ? 1 : 2}
            px={sxDown ? 2 : 3}
            height="100%"
          >
            <Typography
              variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
              component="h3"
              mb={2}
            >
              Recursos Principais
            </Typography>
            <Typography variant="body1" mb={2}>
              Nosso painel de administração oferece uma ampla gama de recursos
              avançados para atender às suas necessidades empresariais.
            </Typography>
            <Typography variant="body1" mb={2}>
              Alguns dos principais recursos incluem:
            </Typography>
            <ol>
              <li>
                <Typography variant="body1">
                  Gerenciamento de clientes
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Gerenciamento de condutores
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Controle de deslocamentos com previsão do tempo
                </Typography>
              </li>
              <li>
                <Typography variant="body1">Controle de veiculos</Typography>
              </li>
            </ol>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component={Paper}
            bgcolor="primary.main"
            color="primary.contrastText"
            py={sxDown ? 1 : 2}
            px={sxDown ? 2 : 3}
            elevation={5}
            height="100%"
          >
            <Typography
              variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
              component="h3"
              mb={2}
            >
              Sobre a Distribuidora
            </Typography>
            <Typography variant="body1" mb={2}>
              Nossa distribuidora está comprometida em fornecer produtos de alta
              qualidade e serviços excepcionais aos nossos clientes.
            </Typography>
            <Typography variant="body1" mb={2}>
              Trabalhamos com uma ampla variedade de produtos, desde alimentos
              até produtos de higiene e limpeza.
            </Typography>
            <Typography variant="body1" mb={2}>
              Nosso objetivo é garantir a satisfação dos nossos clientes e
              fortalecer parcerias duradouras.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

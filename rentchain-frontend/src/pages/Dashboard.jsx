import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Chip,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
  Fab,
  Zoom,
  LinearProgress
} from "@mui/material";
import {
  Home as HomeIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  AccountBalanceWallet as WalletIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  MonetizationOn as MonetizationIcon
} from "@mui/icons-material";
import { getPropertiesByOwner } from "../api/rentchain";
import StatusChip from "../components/StatusChip";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  cardHover,
  cardTap,
  containerVariants,
  itemVariants
} from '../animations';

const landlordAddress = "0x85f6FfCD9072d5Cf33EFE4b067100F267F32b20D"; // Use real address

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const controls = useAnimation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const props = await getPropertiesByOwner(landlordAddress);
        setProperties(props);
        controls.start("visible");
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [controls]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    occupied: properties.filter(p => p.status === 'occupied').length,
    terminated: properties.filter(p => p.status === 'terminated').length,
  };

  const totalRevenue = properties
    .filter(p => p.status === 'occupied')
    .reduce((sum, p) => sum + parseFloat(p.rentEth || 0), 0);

  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(255,255,255,0.2)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.1)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                {value}
              </Typography>
            </motion.div>
            <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mt: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
              borderRadius: 3,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 15px ${color}30`
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          </Box>
        </Box>
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                  borderRadius: 3
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </motion.div>
  );

  const PropertyCard = ({ property, index }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      whileHover={cardHover}
      whileTap={cardTap}
      layout
    >
      <Card sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0) 0%, rgba(37, 99, 235, 0.02) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': {
          opacity: 1,
        }
      }}>
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1, mr: 1 }}>
              {property.title}
            </Typography>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <StatusChip status={property.status} />
            </motion.div>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {property.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {property.rentEth} ETH
              </Typography>
              <Typography variant="caption" color="text.secondary">
                per month • Deposit: {property.depositEth} ETH
              </Typography>
            </Box>
          </Box>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              component={Link}
              to={`/property/${property._id}`}
              variant="outlined"
              fullWidth
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                }
              }}
            >
              View Details
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            py: { xs: 6, md: 8 },
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.1,
            }
          }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center" sx={{ position: 'relative', zIndex: 2 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight={800}
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    mb: 2
                  }}
                >
                  Property Dashboard
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Typography
                  variant="h5"
                  component="p"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                    maxWidth: 700,
                    mx: 'auto',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Manage your rental properties and track performance with advanced analytics
                </Typography>
              </motion.div>
            </Box>
          </Container>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '8%',
              opacity: 0.1,
            }}
          >
            <AnalyticsIcon sx={{ fontSize: 60 }} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '8%',
              opacity: 0.1,
            }}
          >
            <MonetizationIcon sx={{ fontSize: 50 }} />
          </motion.div>
        </Paper>
      </motion.div>

      <Container maxWidth="lg" sx={{ py: 6, mt: -4, position: 'relative', zIndex: 3 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats */}
          <Box sx={{ mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Portfolio Overview
              </Typography>
            </motion.div>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Properties"
                  value={stats.total}
                  subtitle="In portfolio"
                  icon={<HomeIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />}
                  color={theme.palette.primary.main}
                  progress={stats.total > 0 ? 100 : 0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Available"
                  value={stats.available}
                  subtitle="Ready to rent"
                  icon={<TrendingIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />}
                  color={theme.palette.success.main}
                  progress={stats.total > 0 ? (stats.available / stats.total) * 100 : 0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Occupied"
                  value={stats.occupied}
                  subtitle={`${totalRevenue.toFixed(2)} ETH revenue`}
                  icon={<WalletIcon sx={{ fontSize: 32, color: theme.palette.info.main }} />}
                  color={theme.palette.info.main}
                  progress={stats.total > 0 ? (stats.occupied / stats.total) * 100 : 0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Terminated"
                  value={stats.terminated}
                  subtitle="Completed contracts"
                  icon={<DashboardIcon sx={{ fontSize: 32, color: theme.palette.error.main }} />}
                  color={theme.palette.error.main}
                  progress={stats.total > 0 ? (stats.terminated / stats.total) * 100 : 0}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Box sx={{ mb: 6, display: 'flex', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: isMobile ? 'none' : 1 }}
              >
                <Button
                  component={Link}
                  to="/deploy"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 2,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    }
                  }}
                >
                  List New Property
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: isMobile ? 'none' : 1 }}
              >
                <Button
                  component={Link}
                  to="/listings"
                  variant="outlined"
                  size="large"
                  startIcon={<HomeIcon />}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 600,
                    py: 2,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(37, 99, 235, 0.04)',
                    }
                  }}
                >
                  View All Listings
                </Button>
              </motion.div>
            </Box>
          </motion.div>

          {/* Properties List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <HomeIcon sx={{ mr: 1, color: 'primary.main', fontSize: '2rem' }} />
              </motion.div>
              <Typography variant="h4" fontWeight={700} sx={{ color: 'text.primary' }}>
                Your Properties
              </Typography>
            </Box>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {[...Array(6)].map((_, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <motion.div variants={itemVariants}>
                        <Card sx={{
                          height: '100%',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ height: 24, backgroundColor: 'grey.300', borderRadius: 1, width: '60%' }} />
                              <Box sx={{ height: 24, backgroundColor: 'grey.300', borderRadius: 1, width: 80 }} />
                            </Box>
                            <Box sx={{ height: 40, backgroundColor: 'grey.300', borderRadius: 1, mb: 2 }} />
                            <Box sx={{ height: 48, backgroundColor: 'grey.300', borderRadius: 2 }} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            ) : properties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 8,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 4,
                    borderStyle: 'dashed'
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <HomeIcon sx={{ fontSize: 80, color: 'grey.400', mb: 3 }} />
                  </motion.div>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No properties found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    You haven't listed any properties yet. Start building your rental portfolio today.
                  </Typography>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      component={Link}
                      to="/deploy"
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                        }
                      }}
                    >
                      List Your First Property
                    </Button>
                  </motion.div>
                </Paper>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key="properties-grid"
              >
                <Grid container spacing={4}>
                  {properties.map((property, index) => (
                    <Grid item xs={12} md={6} lg={4} key={property._id}>
                      <PropertyCard property={property} index={index} />
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="large"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            }
          }}
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ↑
          </motion.div>
        </Fab>
      </Zoom>
    </Box>
  );
}

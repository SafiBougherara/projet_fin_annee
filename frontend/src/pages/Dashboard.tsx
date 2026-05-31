import { useEffect, useMemo, useState } from 'react';
import restaurantService, { type RestaurantItem } from '../services/restaurant.service';
import reservationService, { type ReservationItem, type CreateReservationPayload } from '../services/reservation.service';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tooltip,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TelegramIcon from '@mui/icons-material/Telegram';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import axios from 'axios';
import '../App.css';

const initialForm = {
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  restaurantId: '',
  tableId: '',
  dateReservation: '',
  heureReservation: '',
  nombrePersonnes: '2',
  demandesSpeciales: '',
};

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [telegramBotUsername, setTelegramBotUsername] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  
  // States for interactive room plan (Plan de Salle)
  const [activeRestaurantId, setActiveRestaurantId] = useState<number>(1);
  const [mapDate, setMapDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [mapTimeMinutes, setMapTimeMinutes] = useState<number>(() => {
    const now = new Date();
    return Math.max(660, Math.min(1410, now.getHours() * 60 + now.getMinutes()));
  });

  const mapTimeStr = useMemo(() => {
    const hrs = Math.floor(mapTimeMinutes / 60);
    const mins = mapTimeMinutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }, [mapTimeMinutes]);

  const activeRestaurant = useMemo(() => {
    return restaurants.find((r) => r.id === activeRestaurantId) || restaurants[0] || null;
  }, [activeRestaurantId, restaurants]);

  const getTableStatus = (tableId: number) => {
    if (!activeRestaurant) return { status: 'free', reservation: null };

    const [sliderHrs, sliderMins] = mapTimeStr.split(':').map(Number);
    const sliderTimeSeconds = (sliderHrs * 60 + sliderMins) * 60;

    const tableReservations = reservations.filter((res) => {
      return (
        res.restaurant.id === activeRestaurant.id &&
        res.table?.id === tableId &&
        res.dateReservation === mapDate &&
        res.statut !== 'annulée' &&
        res.statut !== 'annulee'
      );
    });

    let isOccupied = false;
    let isImminent = false;
    let isReservedLater = false;
    let activeReservation: ReservationItem | null = null;
    let upcomingReservation: ReservationItem | null = null;

    const mealDuration = activeRestaurant.dureeRepas || 90;
    const cleaningBuffer = activeRestaurant.bufferNettoyage || 15;
    const totalDurationSeconds = (mealDuration + cleaningBuffer) * 60;

    for (const res of tableReservations) {
      if (!res.heureReservation) continue;
      const [resHrs, resMins] = res.heureReservation.split(':').map(Number);
      const resStartSeconds = (resHrs * 60 + resMins) * 60;
      const resEndSeconds = resStartSeconds + totalDurationSeconds;

      if (sliderTimeSeconds >= resStartSeconds && sliderTimeSeconds < resEndSeconds) {
        isOccupied = true;
        activeReservation = res;
        break;
      }

      const diffMinutes = (resStartSeconds - sliderTimeSeconds) / 60;
      if (diffMinutes > 0 && diffMinutes <= 30) {
        isImminent = true;
        activeReservation = res;
      }

      if (resStartSeconds > sliderTimeSeconds) {
        isReservedLater = true;
        if (!upcomingReservation) {
          upcomingReservation = res;
        } else {
          const [uHrs, uMins] = upcomingReservation.heureReservation.split(':').map(Number);
          const uStartSeconds = (uHrs * 60 + uMins) * 60;
          if (resStartSeconds < uStartSeconds) {
            upcomingReservation = res;
          }
        }
      }
    }

    if (isOccupied) {
      return { status: 'occupied', reservation: activeReservation };
    }
    if (isImminent) {
      return { status: 'imminent', reservation: activeReservation };
    }
    if (isReservedLater) {
      return { status: 'reserved', reservation: upcomingReservation };
    }
    return { status: 'free', reservation: null };
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // States for Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    restaurantId: '',
    tableId: '',
    dateReservation: '',
    heureReservation: '',
    nombrePersonnes: '2',
    demandesSpeciales: '',
    statut: 'confirmée',
  });

  // States for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<ReservationItem | null>(null);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === Number(form.restaurantId)),
    [form.restaurantId, restaurants],
  );

  const editSelectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === Number(editForm.restaurantId)),
    [editForm.restaurantId, restaurants],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantsData, reservationsData] = await Promise.all([
          restaurantService.getRestaurants(),
          reservationService.getReservations(),
        ]);
        setRestaurants(restaurantsData);
        setReservations(reservationsData);
        if (restaurantsData.length > 0) {
          setForm((prev) => ({
            ...prev,
            restaurantId: prev.restaurantId || String(restaurantsData[0].id),
          }));
          setActiveRestaurantId(restaurantsData[0].id);
        }

        // Charger la config Telegram
        try {
          const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
          const configRes = await axios.get(`${apiUrl}/api/chatbot/config`);
          if (configRes.data.telegramBotUsername) {
            setTelegramBotUsername(configRes.data.telegramBotUsername);
          }
        } catch (e) {
          console.error("Impossible de charger la config Telegram", e);
        }
      } catch (err) {
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshReservations = async () => {
    try {
      const reservationsData = await reservationService.getReservations();
      setReservations(reservationsData);
    } catch {
      setError('Échec de récupération des réservations.');
    }
  };

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEditChange = (field: keyof typeof editForm) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    setEditForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!form.clientName || !form.clientPhone || !form.dateReservation || !form.heureReservation || !form.restaurantId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setSaving(false);
      return;
    }

    const payload: CreateReservationPayload = {
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      clientEmail: form.clientEmail || undefined,
      restaurantId: Number(form.restaurantId),
      tableId: form.tableId ? Number(form.tableId) : undefined,
      dateReservation: form.dateReservation,
      heureReservation: form.heureReservation,
      nombrePersonnes: Number(form.nombrePersonnes),
      demandesSpeciales: form.demandesSpeciales || undefined,
    };

    try {
      await reservationService.createReservation(payload);
      setSuccess('Réservation créée avec succès.');
      setForm((prev) => ({
        ...prev,
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        tableId: '',
        dateReservation: '',
        heureReservation: '',
        nombrePersonnes: '2',
        demandesSpeciales: '',
      }));
      await refreshReservations();
    } catch {
      setError('Erreur lors de la création de la réservation.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (res: ReservationItem) => {
    setEditForm({
      id: res.id,
      clientName: res.client.nom ?? '',
      clientPhone: res.client.telephone ?? '',
      clientEmail: res.client.email ?? '',
      restaurantId: String(res.restaurant.id ?? ''),
      tableId: String(res.table?.id ?? ''),
      dateReservation: res.dateReservation ?? '',
      heureReservation: res.heureReservation ?? '',
      nombrePersonnes: String(res.nombrePersonnes ?? '2'),
      demandesSpeciales: res.demandesSpeciales ?? '',
      statut: res.statut ?? 'confirmée',
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!editForm.clientName || !editForm.clientPhone || !editForm.dateReservation || !editForm.heureReservation || !editForm.restaurantId) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setSaving(false);
      return;
    }

    try {
      await reservationService.updateReservation(editForm.id, {
        clientName: editForm.clientName,
        clientPhone: editForm.clientPhone,
        clientEmail: editForm.clientEmail || undefined,
        restaurantId: Number(editForm.restaurantId),
        tableId: editForm.tableId ? Number(editForm.tableId) : null,
        dateReservation: editForm.dateReservation,
        heureReservation: editForm.heureReservation,
        nombrePersonnes: Number(editForm.nombrePersonnes),
        demandesSpeciales: editForm.demandesSpeciales || undefined,
        statut: editForm.statut,
      });
      setSuccess('Réservation mise à jour avec succès.');
      setEditOpen(false);
      await refreshReservations();
    } catch {
      setError('Erreur lors de la modification de la réservation.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (res: ReservationItem) => {
    setReservationToDelete(res);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservationToDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await reservationService.deleteReservation(reservationToDelete.id);
      setSuccess('Réservation supprimée avec succès.');
      setDeleteConfirmOpen(false);
      setReservationToDelete(null);
      await refreshReservations();
    } catch {
      setError('Erreur lors de la suppression de la réservation.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, maxWidth: 1400, mx: 'auto' }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" gutterBottom>
          Tableau de Bord des Réservations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gère en temps réel les réservations, affecte les tables et change les statuts de tes clients.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Plan de Salle Interactif */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ boxShadow: 3, mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3} sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <RestaurantIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Plan de Salle Interactif
                  </Typography>
                </Box>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="map-restaurant-label">Restaurant</InputLabel>
                    <Select
                      labelId="map-restaurant-label"
                      value={String(activeRestaurantId)}
                      label="Restaurant"
                      onChange={(e) => setActiveRestaurantId(Number(e.target.value))}
                    >
                      {restaurants.map((restaurant) => (
                        <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                          {restaurant.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Date du plan"
                    type="date"
                    value={mapDate}
                    onChange={(e) => setMapDate(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Box>

              {/* Time slider section */}
              <Box sx={{ px: 2, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium" color="text.secondary">
                      Timeline de Service
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {mapTimeStr.replace(':', 'h')}
                  </Typography>
                </Box>
                <Slider
                  value={mapTimeMinutes}
                  min={660} // 11:00
                  max={1410} // 23:30
                  step={15}
                  marks={[
                    { value: 660, label: '11h00' },
                    { value: 720, label: '12h00' },
                    { value: 780, label: '13h00' },
                    { value: 840, label: '14h00' },
                    { value: 900, label: '15h00' },
                    { value: 960, label: '16h00' },
                    { value: 1020, label: '17h00' },
                    { value: 1080, label: '18h00' },
                    { value: 1140, label: '19h00' },
                    { value: 1200, label: '20h00' },
                    { value: 1260, label: '21h00' },
                    { value: 1320, label: '22h00' },
                    { value: 1380, label: '23h00' },
                    { value: 1410, label: '23h30' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(val) => val === 1410 ? '23h30' : `${Math.floor(val / 60)}h${String(val % 60).padStart(2, '0')}`}
                  onChange={(_, newValue) => setMapTimeMinutes(newValue as number)}
                  sx={{
                    color: 'primary.main',
                    height: 6,
                    '& .MuiSlider-thumb': {
                      width: 18,
                      height: 18,
                      transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                      '&:before': {
                        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                      },
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0px 0px 0px 8px rgba(79, 70, 229, 0.16)',
                      },
                      '&.Mui-active': {
                        width: 22,
                        height: 22,
                      },
                    },
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </Box>

              {/* Interactive room plan grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: 2,
                  mt: 4,
                  mb: 3,
                }}
              >
                {activeRestaurant?.tables && activeRestaurant.tables.length > 0 ? (
                  activeRestaurant.tables.map((table) => {
                    const { status, reservation } = getTableStatus(table.id);
                    
                    let bgColor = '';
                    let borderColor = '';
                    let textColor = '';
                    let statusLabel = '';
                    
                    switch (status) {
                      case 'occupied':
                        bgColor = 'rgba(244, 63, 94, 0.08)';
                        borderColor = '#f43f5e';
                        textColor = '#e11d48';
                        statusLabel = 'Occupée';
                        break;
                      case 'imminent':
                        bgColor = 'rgba(245, 158, 11, 0.08)';
                        borderColor = '#f59e0b';
                        textColor = '#d97706';
                        statusLabel = 'Imminent';
                        break;
                      case 'reserved':
                        bgColor = 'rgba(14, 165, 233, 0.08)';
                        borderColor = '#0ea5e9';
                        textColor = '#0284c7';
                        statusLabel = 'Réservée';
                        break;
                      default:
                        bgColor = 'rgba(16, 185, 129, 0.08)';
                        borderColor = '#10b981';
                        textColor = '#059669';
                        statusLabel = 'Libre';
                        break;
                    }
                    
                    return (
                      <Tooltip
                        key={table.id}
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 0.5, mb: 0.5 }}>
                              Table {table.numeroTable} ({table.capacite} pers)
                            </Typography>
                            {status === 'occupied' && reservation && (
                              <>
                                <Typography variant="body2" sx={{ color: '#fda4af', fontWeight: 'bold' }}>
                                  🔴 Occupée (repas en cours)
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Client :</strong> {reservation.client.nom}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Tél :</strong> {reservation.client.telephone}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Couverts :</strong> {reservation.nombrePersonnes} pers.
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Heure :</strong> {reservation.heureReservation}
                                </Typography>
                                {reservation.demandesSpeciales && (
                                  <Typography variant="caption" display="block" sx={{ fontStyle: 'italic', mt: 0.5, color: '#cbd5e1' }}>
                                    Note: {reservation.demandesSpeciales}
                                  </Typography>
                                )}
                              </>
                            )}
                            {status === 'imminent' && reservation && (
                              <>
                                <Typography variant="body2" sx={{ color: '#fcd34d', fontWeight: 'bold' }}>
                                  🟠 Arrivée Imminente ({reservation.heureReservation})
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Client :</strong> {reservation.client.nom}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Tél :</strong> {reservation.client.telephone}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Couverts :</strong> {reservation.nombrePersonnes} pers.
                                </Typography>
                              </>
                            )}
                            {status === 'reserved' && reservation && (
                              <>
                                <Typography variant="body2" sx={{ color: '#7dd3fc', fontWeight: 'bold' }}>
                                  🔵 Réservée plus tard ({reservation.heureReservation})
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  <strong>Client :</strong> {reservation.client.nom}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Tél :</strong> {reservation.client.telephone}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Couverts :</strong> {reservation.nombrePersonnes} pers.
                                </Typography>
                              </>
                            )}
                            {status === 'free' && (
                              <Typography variant="body2" sx={{ color: '#a7f3d0' }}>
                                🟢 Libre toute la journée
                              </Typography>
                            )}
                          </Box>
                        }
                        arrow
                        placement="top"
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: bgColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 3,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.05) translateY(-3px)',
                              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: table.capacite > 4 ? '4px' : '50%',
                              backgroundColor: borderColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              mb: 1,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                          >
                            {table.numeroTable}
                          </Box>
                          <Typography variant="body2" fontWeight="bold" sx={{ color: textColor }}>
                            {table.capacite} pers
                          </Typography>
                          <Typography variant="caption" sx={{ color: textColor, opacity: 0.8, fontSize: '0.7rem', textTransform: 'uppercase', mt: 0.5 }}>
                            {statusLabel}
                          </Typography>
                        </Paper>
                      </Tooltip>
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, gridColumn: '1 / -1', textAlign: 'center' }}>
                    Aucune table configurée pour ce restaurant.
                  </Typography>
                )}
              </Box>

              {/* Color Legend */}
              <Box display="flex" flexWrap="wrap" gap={3} justifyContent="center" sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981' }} />
                  <Typography variant="body2" color="text.secondary">Libre</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'rgba(14, 165, 233, 0.2)', border: '2px solid #0ea5e9' }} />
                  <Typography variant="body2" color="text.secondary">Réservée plus tard</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'rgba(245, 158, 11, 0.2)', border: '2px solid #f59e0b' }} />
                  <Typography variant="body2" color="text.secondary">Arrivée imminente (&lt; 30 min)</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: 'rgba(244, 63, 94, 0.2)', border: '2px solid #f43f5e' }} />
                  <Typography variant="body2" color="text.secondary">Occupée (repas en cours)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulaire de création */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                Nouvelle réservation
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  label="Nom du client"
                  value={form.clientName}
                  onChange={handleChange('clientName')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                />
                <TextField
                  label="Téléphone"
                  value={form.clientPhone}
                  onChange={handleChange('clientPhone')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                />
                <TextField
                  label="Email"
                  value={form.clientEmail}
                  onChange={handleChange('clientEmail')}
                  fullWidth
                  margin="dense"
                  size="small"
                />
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="restaurant-label">Restaurant</InputLabel>
                  <Select
                    labelId="restaurant-label"
                    value={form.restaurantId}
                    label="Restaurant"
                    onChange={handleChange('restaurantId')}
                    required
                  >
                    {restaurants.map((restaurant) => (
                      <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                        {restaurant.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense" size="small">
                  <InputLabel id="table-label">Table (optionnelle)</InputLabel>
                  <Select
                    labelId="table-label"
                    value={form.tableId}
                    label="Table (optionnelle)"
                    onChange={handleChange('tableId')}
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {selectedRestaurant?.tables.map((table) => (
                      <MenuItem key={table.id} value={String(table.id)}>
                        {`Table ${table.numeroTable} - ${table.capacite} pers.`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Date"
                  type="date"
                  value={form.dateReservation}
                  onChange={handleChange('dateReservation')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Heure"
                  type="time"
                  value={form.heureReservation}
                  onChange={handleChange('heureReservation')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Nombre de personnes"
                  type="number"
                  value={form.nombrePersonnes}
                  onChange={handleChange('nombrePersonnes')}
                  fullWidth
                  required
                  margin="dense"
                  size="small"
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Demande spéciale"
                  value={form.demandesSpeciales}
                  onChange={handleChange('demandesSpeciales')}
                  fullWidth
                  margin="dense"
                  size="small"
                  multiline
                  rows={2}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={saving} sx={{ mt: 2, fontWeight: 'bold' }}>
                  {saving ? 'Enregistrement...' : 'Créer la réservation'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {telegramBotUsername && telegramBotUsername !== 'your_telegram_bot_username_here' && (
            <Card sx={{ boxShadow: 3, mt: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
                  <TelegramIcon sx={{ color: '#0088cc', fontSize: '2rem' }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
                    Réservation par Bot Telegram
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Scannez ce QR Code avec votre smartphone pour tester la réservation par intelligence artificielle !
                </Typography>
                <Box 
                  sx={{ 
                    display: 'inline-block', 
                    p: 1.5, 
                    bgcolor: 'white', 
                    borderRadius: 3, 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    mb: 2
                  }}
                >
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/${telegramBotUsername}`}
                    alt="Telegram Bot QR Code"
                    style={{ display: 'block', width: 140, height: 140 }}
                  />
                </Box>
                <Button 
                  href={`https://t.me/${telegramBotUsername}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    bgcolor: '#0088cc', 
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#0077b5' }
                  }}
                >
                  Discuter avec le Bot (@{telegramBotUsername})
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
                  Commandes : <strong>/start</strong> pour débuter, <strong>/reset</strong> pour réinitialiser la session.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Tableau des réservations */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
                Liste des Réservations ({reservations.length})
              </Typography>
              <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Heure</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Restaurant</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Table</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Personnes</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id} hover>
                        <TableCell>{reservation.dateReservation}</TableCell>
                        <TableCell>{reservation.heureReservation}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {reservation.client.nom ?? 'Sans nom'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reservation.client.telephone}
                          </Typography>
                        </TableCell>
                        <TableCell>{reservation.restaurant.nom}</TableCell>
                        <TableCell>
                          {reservation.table ? (
                            <Box sx={{ bgcolor: 'rgba(79, 70, 229, 0.08)', color: 'primary.main', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', fontWeight: 'bold' }}>
                              T. {reservation.table.numeroTable}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Non assignée
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{reservation.nombrePersonnes}</TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              textTransform: 'capitalize',
                              bgcolor:
                                reservation.statut === 'confirmée' ? '#e8f5e9' :
                                reservation.statut === 'terminée' ? '#eceff1' : '#ffebee',
                              color:
                                reservation.statut === 'confirmée' ? '#2e7d32' :
                                reservation.statut === 'terminée' ? '#37474f' : '#c62828',
                            }}
                          >
                            {reservation.statut}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box display="flex" justifyContent="flex-end" gap={0.5}>
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(reservation)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(reservation)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {reservations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                          Aucune réservation enregistrée.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modal Edition */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Modifier la réservation</DialogTitle>
        <Box component="form" onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nom du client"
                  value={editForm.clientName}
                  onChange={handleEditChange('clientName')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Téléphone"
                  value={editForm.clientPhone}
                  onChange={handleEditChange('clientPhone')}
                  fullWidth
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  value={editForm.clientEmail}
                  onChange={handleEditChange('clientEmail')}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-restaurant-label">Restaurant</InputLabel>
                  <Select
                    labelId="edit-restaurant-label"
                    value={editForm.restaurantId}
                    label="Restaurant"
                    onChange={handleEditChange('restaurantId')}
                    required
                  >
                    {restaurants.map((restaurant) => (
                      <MenuItem key={restaurant.id} value={String(restaurant.id)}>
                        {restaurant.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-table-label">Table (optionnelle)</InputLabel>
                  <Select
                    labelId="edit-table-label"
                    value={editForm.tableId}
                    label="Table (optionnelle)"
                    onChange={handleEditChange('tableId')}
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {editSelectedRestaurant?.tables.map((table) => (
                      <MenuItem key={table.id} value={String(table.id)}>
                        {`Table ${table.numeroTable} - ${table.capacite} pers.`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={editForm.dateReservation}
                  onChange={handleEditChange('dateReservation')}
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Heure"
                  type="time"
                  value={editForm.heureReservation}
                  onChange={handleEditChange('heureReservation')}
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nombre de personnes"
                  type="number"
                  value={editForm.nombrePersonnes}
                  onChange={handleEditChange('nombrePersonnes')}
                  fullWidth
                  required
                  size="small"
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-statut-label">Statut</InputLabel>
                  <Select
                    labelId="edit-statut-label"
                    value={editForm.statut}
                    label="Statut"
                    onChange={handleEditChange('statut')}
                    required
                  >
                    <MenuItem value="confirmée">Confirmée</MenuItem>
                    <MenuItem value="annulée">Annulée</MenuItem>
                    <MenuItem value="terminée">Terminée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Demande spéciale"
                  value={editForm.demandesSpeciales}
                  onChange={handleEditChange('demandesSpeciales')}
                  fullWidth
                  size="small"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditOpen(false)} variant="outlined">
              Annuler
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Modal Deletion Confirm */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Es-tu sûr de vouloir supprimer la réservation de{' '}
            <strong>{reservationToDelete?.client.nom ?? 'ce client'}</strong> le{' '}
            <strong>{reservationToDelete?.dateReservation}</strong> à{' '}
            <strong>{reservationToDelete?.heureReservation}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

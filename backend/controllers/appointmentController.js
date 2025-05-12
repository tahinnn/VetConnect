const appointmentService = require('../services/appointmentService');
const { AppError } = require('../utils/errorHandler');

const createAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(req.body);
        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await appointmentService.getAppointmentById(req.params.id);
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        next(error);
    }
};

const updateAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

const deleteAppointment = async (req, res, next) => {
    try {
        await appointmentService.deleteAppointment(req.params.id);
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAppointment,
    getAppointmentById,
    getAllAppointments,
    updateAppointment,
    deleteAppointment
}; 
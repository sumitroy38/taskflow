package com.taskflow.backend.service;

import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request, String email) {
        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(Task.Status.TODO);
        task.setCreatedBy(creator);
        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignedTo(assignee);
        }
        return mapToResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getAllTasks(String status, Long assignedToId) {
        List<Task> tasks;
        if (status != null && assignedToId != null) {
            User user = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            tasks = taskRepository.findByAssignedToAndStatus(user, Task.Status.valueOf(status));
        } else if (status != null) {
            tasks = taskRepository.findByStatus(Task.Status.valueOf(status));
        } else if (assignedToId != null) {
            User user = userRepository.findById(assignedToId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            tasks = taskRepository.findByAssignedTo(user);
        } else {
            tasks = taskRepository.findAll();
        }
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToResponse(task);
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String email) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(Task.Status.valueOf(request.getStatus()));
        }
        if (request.getAssignedToId() != null) {
            User assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignedTo(assignee);
        }
        task.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus().name());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        if (task.getAssignedTo() != null) {
            response.setAssignedToName(task.getAssignedTo().getName());
            response.setAssignedToId(task.getAssignedTo().getId());
        }
        if (task.getCreatedBy() != null) {
            response.setCreatedByName(task.getCreatedBy().getName());
            response.setCreatedById(task.getCreatedBy().getId());
        }
        return response;
    }
}